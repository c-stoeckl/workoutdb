import { createClient } from "@/utils/supabase/server";
import type { WorkoutWithDetails } from "@/types/database";
import { workoutConfig } from "@/types/workout";
import { unstable_cache } from "next/cache"; // Re-import unstable_cache
import { SupabaseClient } from "@supabase/supabase-js";

const WORKOUT_SELECT_QUERY = `
  *,
  type:workout_types(id, name, created_at),
  workout_exercises(
    id,
    sets,
    reps,
    weight,
    weight_unit,
    duration,
    rest_period,
    order,
    notes,
    exercise_definition:exercise_definitions(
      id,
      name,
      description,
      video_url,
      primary_muscle_group
    )
  ),
  favorites:favorites(count)
`;

// Internal function for fetching favorite workouts data
const fetchFavoriteWorkoutsData = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<WorkoutWithDetails[]> => {
  // First get the user's favorited workout IDs
  const { data: favorites, error: favError } = await supabase
    .from("favorites")
    .select("workout_id")
    .eq("user_id", userId);

  if (favError) {
    console.error("Error fetching favorite workout IDs:", favError);
    throw new Error(`Error fetching favorite workout IDs: ${favError.message}`);
  }

  if (!favorites?.length) {
    return [];
  }

  // Then fetch the favorited workouts
  const { data: fetchedWorkouts, error } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT_QUERY)
    .order("created_at", { ascending: false })
    .in("id", favorites.map((f) => f.workout_id));

  if (error) {
    console.error("Error fetching favorite workouts:", error);
    throw new Error(`Error fetching favorite workouts: ${error.message}`);
  }

  // Transform fetched data
  return (fetchedWorkouts ?? [])
    .map((w) => ({
      id: w.id,
      name: w.name,
      description: w.description,
      type_id: w.type_id,
      user_id: w.created_by,
      is_public: true,
      created_at: w.created_at,
      updated_at: w.created_at,
      type: w.type ?? {
        id: "unknown",
        name: "Unknown",
        created_at: w.created_at,
      },
      exercises: w.workout_exercises ?? [],
      favorites_count: w.favorites?.[0]?.count ?? 0,
      is_favorited: true, // Since these are favorites, we know they're favorited
    }))
    .filter((w) => w.type && Object.keys(workoutConfig).includes(w.type.name));
};

// Restore unstable_cache wrapper for favorite workouts (internal)
const getCachedFavoriteWorkouts = unstable_cache(
  async (supabase: SupabaseClient, userId: string) =>
    fetchFavoriteWorkoutsData(supabase, userId),
  ["favorite-workouts"], // Base key
  {
    tags: ["workouts", "favorites"],
    revalidate: 60,
  },
);

// --- Helper function to fetch favorite IDs --- //
const fetchUserFavoriteIds = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<Set<string>> => {
  const { data: favorites, error } = await supabase
    .from("favorites")
    .select("workout_id")
    .eq("user_id", userId);

  if (error) {
    console.error(`Error fetching favorite IDs for user ${userId}:`, error);
    // Return empty set on error to avoid breaking main fetch
    return new Set<string>();
  }

  const favoriteIds = new Set(favorites?.map((f) => f.workout_id) ?? []);

  return favoriteIds;
};

// Restore unstable_cache wrapper for favorite IDs (Exported)
export const getCachedUserFavoriteIds = unstable_cache(
  fetchUserFavoriteIds,
  ["user-favorite-ids"], // Base key, userId included automatically
  {
    tags: ["favorites"], // Tag for revalidation
    revalidate: 60, // Or adjust as needed
  },
);

const fetchWorkoutsData = async (
  supabase: SupabaseClient,
  userFavorites: Set<string>, // Accept pre-fetched favorites
): Promise<WorkoutWithDetails[]> => {
  // Fetch all public workouts using the passed client
  const { data: fetchedWorkouts, error } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT_QUERY)
    // .eq('is_public', true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching workouts:", error);
    throw new Error(`Error fetching workouts: ${error.message}`);
  }

  // Transform fetched data (same as before)
  return (fetchedWorkouts ?? [])
    .map((w) => {
      const isFavorited = userFavorites.has(w.id);

      return {
        id: w.id,
        name: w.name,
        description: w.description,
        type_id: w.type_id,
        user_id: w.created_by,
        is_public: true,
        created_at: w.created_at,
        updated_at: w.created_at,
        type: w.type ?? {
          id: "unknown",
          name: "Unknown",
          created_at: w.created_at,
        },
        exercises: w.workout_exercises ?? [],
        favorites_count: w.favorites?.[0]?.count ?? 0,
        is_favorited: isFavorited,
      };
    })
    .filter((w) => w.type && Object.keys(workoutConfig).includes(w.type.name));
};

// Restore unstable_cache wrapper for getWorkouts (Exported)
export const getWorkouts = unstable_cache(
  async (supabase: SupabaseClient, userId?: string) => {
    const userFavorites = userId
      ? await getCachedUserFavoriteIds(supabase, userId)
      : new Set<string>();
    return fetchWorkoutsData(supabase, userFavorites);
  },
  ["workouts"],
  {
    tags: ["workouts", "favorites"],
    revalidate: 60,
  },
);

// Internal function for fetching a single workout's data
const fetchWorkoutData = async (
  supabase: SupabaseClient,
  id: string,
  isFavorited: boolean, // Accept pre-determined favorite status
): Promise<WorkoutWithDetails> => {
  const { data: workout, error } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT_QUERY)
    .eq("id", id)
    .single();

  if (error || !workout) {
    console.error(`Error fetching workout ${id}:`, error);
    throw new Error(`Error fetching workout: ${error?.message ?? "Not found"}`);
  }

  return {
    id: workout.id,
    name: workout.name,
    description: workout.description,
    type_id: workout.type_id,
    user_id: workout.created_by,
    is_public: true, // Assuming public for now, adjust if needed
    created_at: workout.created_at,
    updated_at: workout.created_at,
    type: workout.type ?? {
      id: "unknown",
      name: "Unknown",
      created_at: workout.created_at,
    },
    exercises: workout.workout_exercises ?? [],
    favorites_count: workout.favorites?.[0]?.count ?? 0,
    is_favorited: isFavorited,
  };
};

// Restore unstable_cache wrapper for single workout (Internal)
const getCachedWorkout = unstable_cache(
  async (supabase: SupabaseClient, workoutId: string, userId?: string) => {
    const userFavorites = userId
      ? await getCachedUserFavoriteIds(supabase, userId)
      : new Set<string>();
    const isFavorited = userFavorites.has(workoutId);
    return fetchWorkoutData(supabase, workoutId, isFavorited);
  },
  ["workout-details"],
  {
    tags: ["workouts", "workout-detail"], // Add relevant tags
    revalidate: 60,
  },
);

// --- Exported function for Favorite Workouts --- //
// Kept signature as is, calls cached internal function
export async function getFavoriteWorkouts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Call the cached function
  return getCachedFavoriteWorkouts(supabase, user.id);
}

// --- Exported function for Single Workout --- //
// Kept signature as is, calls cached internal function
export async function getWorkout(id: string): Promise<WorkoutWithDetails> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return getCachedWorkout(supabase, id, user?.id);
}

// --- Exported function for Toggle Favorite --- //
// This is a mutation, not cached by unstable_cache or 'use cache'.
export async function toggleFavorite(
  workoutId: string,
  userId: string,
): Promise<boolean> {
  // No 'use cache' directive here.

  const supabase = await createClient();

  // Check if the favorite record already exists
  const { data: existing, error: checkError } = await supabase
    .from("favorites")
    .select("id")
    .eq("workout_id", workoutId)
    .eq("user_id", userId)
    .maybeSingle(); // Use maybeSingle to handle non-existent records gracefully

  if (checkError) {
    console.error("Error checking for existing favorite:", checkError);
    throw new Error(`Failed to check favorite status: ${checkError.message}`);
  }

  try {
    if (existing) {
      // If it exists, delete it (unfavorite)
      const { error: deleteError } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        console.error("Error deleting favorite:", deleteError);
        throw new Error(`Failed to unfavorite workout: ${deleteError.message}`);
      }
      return false; // Indicates it was unfavorited
    } else {
      // If it doesn't exist, insert it (favorite)
      const { error: insertError } = await supabase
        .from("favorites")
        .insert({ workout_id: workoutId, user_id: userId });

      if (insertError) {
        console.error("Error inserting favorite:", insertError);
        // Handle potential constraint violations, e.g., duplicate insert attempt
        throw new Error(`Failed to favorite workout: ${insertError.message}`);
      }
      return true; // Indicates it was favorited
    }
  } catch (error) {
    // Catch any unexpected errors during delete/insert
    console.error("Error toggling favorite status:", error);
    // Re-throw a generic error or handle as needed
    throw new Error(
      `An unexpected error occurred while toggling favorite status.`,
    );
  }
}
