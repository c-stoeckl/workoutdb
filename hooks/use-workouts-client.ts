import { useQuery } from "@tanstack/react-query";
import { createClient as createBrowserClient } from "@/utils/supabase/client";
import type { WorkoutWithDetails } from "@/types/database";
import { fetchWorkoutsWithFavorites } from "@/services/workouts";

export const workoutsQueryKey = ["workouts"];

/**
 * Custom hook to fetch workout data using React Query (client-side).
 * @returns The result of the query including data, isLoading, error states.
 */
export function useWorkouts() {
  return useQuery<WorkoutWithDetails[], Error>({
    queryKey: workoutsQueryKey,
    queryFn: async () => {
      const supabase = createBrowserClient();
      return fetchWorkoutsWithFavorites(supabase);
    },
  });
}
