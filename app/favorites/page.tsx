import { Suspense } from "react"
import { dehydrate } from "@tanstack/react-query"
import { HydrationBoundary } from "@tanstack/react-query"
import getQueryClient from "@/lib/get-query-client"
import { fetchWorkoutsSSR, workoutsQueryKey } from "@/hooks/use-workouts-server"
import { WorkoutFilterLayout } from "@/components/workout-filter-layout"

export default async function FavoritesPage() {
  const queryClient = getQueryClient()

  // Use SSR-aware fetchWorkouts for prefetching
  await queryClient.prefetchQuery({
    queryKey: workoutsQueryKey,
    queryFn: fetchWorkoutsSSR,
  })

  return (
    <Suspense fallback={<div>Loading favorite workouts...</div>}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <WorkoutFilterLayout filterFavoritesOnly />
      </HydrationBoundary>
    </Suspense>
  )
}
