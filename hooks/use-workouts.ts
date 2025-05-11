import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client"; // Use client-side client
import type {
  ExerciseDefinition,
  WorkoutExercise,
  WorkoutType,
  WorkoutWithDetails,
} from "@/types/database";
import { workoutConfig } from "@/types/workout";
import { parseMinutes } from "@/lib/utils"; // Import from shared utils

// Replicated from services/workouts.ts for now
// TODO: Consider moving to a shared location
const WORKOUT_SELECT_QUERY = `
  *,
  type:workout_types(id, name, created_at),
  workout_exercises(
    *,
    exercise_definition:exercise_definitions(*)
  ),
  favorites:favorites(count)
`;

// Export the query key
export const workoutsQueryKey = ["workouts"];

// Define the query key for fetching favorite workouts
export const favoritesQueryKey = ["favorites"];

/**
 * Fetches all public workouts and determines favorite status for the current user.
 * This function is intended to be used as the queryFn for useQuery.
 * @returns {Promise<WorkoutWithDetails[]>} A promise that resolves to an array of workouts.
 */
// Export the fetch function
export const fetchWorkouts = async (): Promise<WorkoutWithDetails[]> => {
  const supabase = createClient();
  let userFavorites = new Set<string>();

  // 1. Get current user session
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Fetch user's favorite IDs if logged in
  if (user) {
    const { data: favorites, error: favError } = await supabase
      .from("favorites")
      .select("workout_id")
      .eq("user_id", user.id);

    if (favError) {
      console.error(
        `Error fetching favorite IDs for user ${user.id}:`,
        favError,
      );
      // Decide if we should throw or continue without favorites
      // For now, log error and continue
    } else if (favorites) {
      userFavorites = new Set(favorites.map((f) => f.workout_id));
    }
  }

  // 3. Fetch all public workouts
  // Note: Removed .eq('is_public', true) based on the original service logic
  const { data: fetchedWorkouts, error: workoutError } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT_QUERY)
    .order("created_at", { ascending: false });

  if (workoutError) {
    console.error("Error fetching workouts:", workoutError);
    throw new Error(`Error fetching workouts: ${workoutError.message}`);
  }

  // 4. Transform data and mark favorites
  // Define nested types based on the SELECT query
  type RawExerciseDefinition = {
    id: string;
    name: string;
    description: string | null;
    video_url: string | null;
    primary_muscle_group: string | null;
    created_at: string;
  };

  type RawWorkoutExercise = {
    id: string;
    workout_id: string;
    exercise_definition_id: string;
    sets: number | null;
    reps: string | null;
    weight: number | null;
    weight_unit: "kg" | "lbs" | null;
    duration: string | null; // ISO 8601 interval string
    rest_period: string | null; // ISO 8601 interval string
    order: number;
    notes: string | null;
    created_at: string;
    exercise_definition: RawExerciseDefinition | null; // Nested definition
  };

  // Define a type for the raw fetched workout data structure based on the SELECT query
  type RawWorkout = {
    id: string;
    name: string;
    description: string | null;
    type_id: string;
    created_by: string | null;
    created_at: string;
    updated_at: string | null; // Assuming this maps to updated_at
    type: { id: string; name: string; created_at: string } | null; // Nested type relation
    workout_exercises: RawWorkoutExercise[] | null; // Use the specific type here
    favorites: { count: number }[] | null; // Nested favorites relation
  };

  return (fetchedWorkouts ?? [])
    .map((w: RawWorkout) => { // Use the defined RawWorkout type
      const isFavorited = user ? userFavorites.has(w.id) : false;

      // Map raw exercises to the expected WorkoutExercise structure
      const mappedExercises = (w.workout_exercises ?? []).map((ex) => {
        // Destructure numeric fields to handle conversion
        const { reps, sets, weight, duration, rest_period, ...restEx } = ex;

        // Map the nested raw exercise definition
        const mappedDefinition: ExerciseDefinition | null =
          ex.exercise_definition
            ? {
              id: ex.exercise_definition.id,
              name: ex.exercise_definition.name,
              description: ex.exercise_definition.description ?? undefined, // Map null to undefined
              video_url: ex.exercise_definition.video_url ?? undefined, // Map null to undefined
              primary_muscle_group:
                ex.exercise_definition.primary_muscle_group ?? undefined, // Map null to undefined
            }
            : null;

        return {
          ...restEx,
          sets: sets ?? undefined, // Convert null to undefined if necessary for WorkoutExercise type
          reps: reps ?? undefined,
          weight: weight ?? undefined,
          // Convert interval strings to minutes as float
          duration: duration ? parseMinutes(duration) : undefined,
          rest_period: rest_period ? parseMinutes(rest_period) : undefined,
          exercise_definition: mappedDefinition,
        } as WorkoutExercise; // Assert the shape matches WorkoutExercise
      });

      // Map the nested raw workout type
      const mappedType: WorkoutType | null = w.type
        ? {
          id: w.type.id,
          name: w.type.name,
          description: undefined, // Map to undefined instead of null for WorkoutType
          created_at: w.type.created_at,
        }
        : null;

      return {
        id: w.id,
        name: w.name,
        description: w.description,
        type_id: w.type_id,
        user_id: w.created_by, // Map created_by to user_id
        is_public: true, // Add is_public (assuming default true as column missing)
        created_by: w.created_by,
        created_at: w.created_at,
        updated_at: w.updated_at ?? w.created_at, // Use created_at if updated_at is null
        type: mappedType,
        exercises: mappedExercises, // Use the mapped exercises
        favorites_count: w.favorites?.[0]?.count ?? 0,
        is_favorited: isFavorited,
      } as WorkoutWithDetails; // Assert the final mapped object shape
    })
    // Re-apply filter based on workoutConfig
    .filter((w: WorkoutWithDetails) =>
      w.type && Object.keys(workoutConfig).includes(w.type.name)
    );
};

/**
 * Custom hook to fetch workout data using React Query.
 * Handles caching, background updates, etc.
 * @returns The result of the query including data, isLoading, error states.
 */
export function useWorkouts() {
  // Use the exported query key
  return useQuery<WorkoutWithDetails[], Error>({
    queryKey: workoutsQueryKey, // Use exported key
    queryFn: fetchWorkouts,
    // Add other options like staleTime, gcTime if needed
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
