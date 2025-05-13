import { createClient } from "@/utils/supabase/server";
import type { WorkoutWithDetails } from "@/types/database";
import { fetchWorkoutsWithFavorites } from "@/services/workouts";

export const workoutsQueryKey = ["workouts"];

/**
 * SSR/RSC fetcher for workouts. Used in SSR/RSC, e.g. /workouts/page.tsx and /favorites/page.tsx.
 */
export async function fetchWorkoutsSSR(): Promise<WorkoutWithDetails[]> {
  const supabase = await createClient();
  return fetchWorkoutsWithFavorites(supabase);
}
