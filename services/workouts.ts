import type { WorkoutWithDetails } from "@/types/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { WORKOUT_SELECT } from "@/queries/workout-select";
import { mapRawWorkouts, RawWorkout } from "@/hooks/use-workouts-mapping";
import { createClient as createBrowserClient } from "@/utils/supabase/client";

/**
 * Fetch all workouts with favorite status for the current user.
 * @param supabase Supabase client instance (client or server)
 */
export async function fetchWorkoutsWithFavorites(
  supabase: SupabaseClient,
): Promise<WorkoutWithDetails[]> {
  let userFavorites = new Set<string>();
  let user: { id: string } | null = null;
  const { data: userData } = await supabase.auth.getUser();
  user = userData?.user ?? null;
  if (user) {
    const { data: favorites, error: favError } = await supabase
      .from("favorites")
      .select("workout_id")
      .eq("user_id", user.id);
    if (!favError && favorites) {
      userFavorites = new Set(
        favorites.map((f: { workout_id: string }) => f.workout_id),
      );
    }
  }
  const { data, error } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return mapRawWorkouts(data as RawWorkout[], user, userFavorites);
}

// --- Helper function to fetch a single workout --- //
async function fetchWorkoutById(
  supabase: SupabaseClient,
  id: string,
  user: { id: string } | null,
): Promise<WorkoutWithDetails> {
  const { data: workout, error } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT)
    .eq("id", id)
    .single();

  if (error || !workout) {
    console.error(`Error fetching workout ${id}:`, error);
    throw new Error(`Error fetching workout: ${error?.message ?? "Not found"}`);
  }

  let isFavorited = false;
  if (user?.id) {
    const { data: fav, error: favError } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("workout_id", id)
      .maybeSingle(); // Use maybeSingle to avoid error if not found

    if (favError) {
      console.error("Error checking favorite status:", favError);
      // Optionally handle error differently, but for now, assume not favorited
    } else if (fav) {
      isFavorited = true;
    }
  }

  return {
    id: workout.id,
    name: workout.name,
    description: workout.description,
    type_id: workout.type_id,
    user_id: workout.created_by,
    is_public: true,
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
}

/**
 * Fetch a single workout by ID, including favorite status for the current user.
 * Returns null if not found or on error.
 */
export async function getWorkout(
  id: string,
): Promise<WorkoutWithDetails | null> {
  const supabase = createBrowserClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;
  try {
    return await fetchWorkoutById(supabase, id, user);
  } catch (err) {
    console.error("Error in getWorkout:", err);
    return null;
  }
}
