"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
export const favoriteWorkoutIdsQueryKey = ["favoriteWorkoutIds"];

/**
 * Fetches the current user's favorite workout IDs.
 * Returns an array of workout IDs the user has favorited.
 */
export function useFavoriteWorkoutIds() {
  return useQuery<string[]>({
    queryKey: favoriteWorkoutIdsQueryKey,
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select("workout_id")
        .eq("user_id", user.id);
      if (error) {
        console.error(
          "[useFavoriteWorkoutIds] Error fetching favorites:",
          error,
        );
        return [];
      }
      return data?.map((f) => f.workout_id) ?? [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
