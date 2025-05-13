"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleFavoriteAction } from "@/app/actions/workouts";
import { workoutsQueryKey } from "./use-workouts-client";

import type { WorkoutWithDetails } from "@/types/database";

// Type for the variables passed to the mutation function
interface ToggleFavoriteVariables {
  workoutId: string;
  isCurrentlyFavorited: boolean;
}

// Type for the result from the server action
type ToggleFavoriteResult = {
  success: boolean;
  isFavorited: boolean;
  error?: string;
};

// Define the type for the context passed between mutation callbacks
interface MutationContext {
  previousWorkouts?: WorkoutWithDetails[];
}

/**
 * Custom hook to handle toggling the favorite status of a workout.
 * Uses React Query's useMutation for server state updates and optimistic UI.
 *
 * @returns The mutation object from useMutation, containing `mutate`, `isPending`, etc.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation<
    ToggleFavoriteResult,
    Error,
    ToggleFavoriteVariables,
    MutationContext
  >({
    mutationFn: (
      { workoutId, isCurrentlyFavorited }: ToggleFavoriteVariables,
    ) => toggleFavoriteAction(workoutId, isCurrentlyFavorited),

    onMutate: async (
      { workoutId, isCurrentlyFavorited }: ToggleFavoriteVariables,
    ) => {
      console.log("[onMutate] Optimistically updating...", {
        workoutId,
        isCurrentlyFavorited,
      });
      const optimisticIsFavorited = !isCurrentlyFavorited;

      await queryClient.cancelQueries({ queryKey: workoutsQueryKey });

      const previousWorkouts = queryClient.getQueryData<WorkoutWithDetails[]>(
        workoutsQueryKey,
      );

      queryClient.setQueryData<WorkoutWithDetails[]>(
        workoutsQueryKey,
        (oldData) =>
          oldData?.map((workout) => {
            if (workout.id === workoutId) {
              const newCount = (workout.favorites_count ?? 0) +
                (optimisticIsFavorited ? 1 : -1);
              return {
                ...workout,
                is_favorited: optimisticIsFavorited,
                favorites_count: Math.max(0, newCount),
              };
            }
            return workout;
          }),
      );

      return { previousWorkouts };
    },
    onError: (error, _variables, context) => {
      console.error("[onError] Mutation failed:", error);
      toast.error(`Failed to update favorite status: ${error.message}`);
      if (context?.previousWorkouts) {
        queryClient.setQueryData(workoutsQueryKey, context.previousWorkouts);
      }
    },
    onSettled: (data, error) => {
      console.log(
        "[onSettled] Mutation settled. Result:",
        data,
        "Error:",
        error,
      );
      queryClient.invalidateQueries({ queryKey: workoutsQueryKey });
    },
  });
}
