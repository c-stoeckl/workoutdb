"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleFavoriteAction } from "@/app/favorites/actions";
import { favoritesQueryKey, workoutsQueryKey } from "./use-workouts"; 
import type { WorkoutWithDetails } from "@/types/database";

// Type for the variables passed to the mutation function
interface ToggleFavoriteVariables {
  workoutId: string;
  isCurrentlyFavorited: boolean;
}

// Type for the result from the server action
type ToggleFavoriteResult = boolean;

// Define the type for the context passed between mutation callbacks
interface MutationContext {
  previousWorkouts?: WorkoutWithDetails[];
  previousFavorites?: WorkoutWithDetails[];
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
      await queryClient.cancelQueries({ queryKey: favoritesQueryKey });

      const previousWorkouts = queryClient.getQueryData<WorkoutWithDetails[]>(
        workoutsQueryKey,
      );
      const previousFavorites = queryClient.getQueryData<WorkoutWithDetails[]>(
        favoritesQueryKey,
      );

      queryClient.setQueryData<WorkoutWithDetails[]>(
        workoutsQueryKey,
        (oldData) =>
          oldData?.map((workout) => {
            if (workout.id === workoutId) {
              console.log(
                `[onMutate] Updating workout ${workoutId} to is_favorited: ${optimisticIsFavorited}`,
              );
              return { ...workout, is_favorited: optimisticIsFavorited }; 
            }
            return workout;
          }),
      );

      queryClient.setQueryData<WorkoutWithDetails[]>(
        favoritesQueryKey,
        (oldData) => {
          const workoutToUpdate = previousWorkouts?.find((w) =>
            w.id === workoutId
          );
          if (!workoutToUpdate) return oldData; 

          if (!optimisticIsFavorited) { 
            console.log(
              `[onMutate] Removing workout ${workoutId} from favorites list`,
            );
            return oldData?.filter((workout) => workout.id !== workoutId);
          } else {
            console.log(
              `[onMutate] Adding workout ${workoutId} to favorites list`,
            );
            const workoutToAdd = { ...workoutToUpdate, is_favorited: true };
            return oldData ? [...oldData, workoutToAdd] : [workoutToAdd];
          }
        },
      );

      return { previousWorkouts, previousFavorites };
    },
    onError: (error, _variables, context) => { 
      console.error("[onError] Mutation failed:", error);
      toast.error(`Failed to update favorite status: ${error.message}`);
      if (context?.previousWorkouts) {
        queryClient.setQueryData(workoutsQueryKey, context.previousWorkouts);
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(favoritesQueryKey, context.previousFavorites);
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
      queryClient.invalidateQueries({ queryKey: favoritesQueryKey });
    },
  });
}
