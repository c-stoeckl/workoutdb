import type { WorkoutWithDetails } from "@/types/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient as createBrowserClient } from "@/utils/supabase/client"; // Use client-side Supabase

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

// --- Helper function to fetch a single workout --- //
async function fetchWorkoutById(
  supabase: SupabaseClient,
  id: string,
  user: { id: string } | null,
): Promise<WorkoutWithDetails> {
  const { data: workout, error } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT_QUERY)
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

// --- Exported function for Single Workout --- //
export async function getWorkout(id: string): Promise<WorkoutWithDetails> {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  return fetchWorkoutById(supabase, id, user);
}
