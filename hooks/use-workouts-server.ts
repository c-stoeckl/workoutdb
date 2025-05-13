import { createClient } from "@/utils/supabase/server";
import type { WorkoutWithDetails } from "@/types/database";
import { WORKOUT_SELECT } from "@/queries/workout-select";
import { mapRawWorkouts, RawWorkout } from "./use-workouts-mapping";

export const workoutsQueryKey = ["workouts"];
export const favoritesQueryKey = ["favorites"];

/**
 * SSR fetcher for workouts. Used in SSR/RSC, e.g. /workouts/page.tsx and /favorites/page.tsx.
 */
export const fetchWorkoutsSSR = async (): Promise<WorkoutWithDetails[]> => {
  const supabase = await createClient();
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
