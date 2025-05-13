import { useQuery } from "@tanstack/react-query";
import { createClient as createBrowserClient } from "@/utils/supabase/client";
import type { WorkoutWithDetails } from "@/types/database";
import { WORKOUT_SELECT } from "@/queries/workout-select";
import { mapRawWorkouts, RawWorkout } from "./use-workouts-mapping";

export const workoutsQueryKey = ["workouts"];
export const favoritesQueryKey = ["favorites"];

/**
 * Client-side fetcher for workouts. Used in useQuery on the client only.
 */
export const fetchWorkoutsForQuery = async (): Promise<WorkoutWithDetails[]> => {
  const supabase = createBrowserClient();
  let userFavorites = new Set<string>();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: favorites, error: favError } = await supabase
      .from("favorites")
      .select("workout_id")
      .eq("user_id", user.id);
    if (!favError && favorites) {
      userFavorites = new Set(favorites.map((f: any) => f.workout_id));
    }
  }
  const { data, error } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return mapRawWorkouts(data as RawWorkout[], user, userFavorites);
};

/**
 * Custom hook to fetch workout data using React Query.
 * Handles caching, background updates, etc.
 * @returns The result of the query including data, isLoading, error states.
 */
export function useWorkouts() {
  return useQuery<WorkoutWithDetails[], Error>({
    queryKey: workoutsQueryKey,
    queryFn: fetchWorkoutsForQuery,
  });
}
