import { Suspense } from "react"
import { dehydrate } from "@tanstack/react-query"
import { HydrationBoundary } from "@tanstack/react-query"
import getQueryClient from "@/lib/get-query-client"
import { favoritesQueryKey } from "@/hooks/use-workouts"
import { getFavoriteWorkoutsAction } from "./actions"
import { WorkoutFilterLayout } from "@/components/workout-filter-layout"

export default async function FavoritesPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: favoritesQueryKey,
    queryFn: getFavoriteWorkoutsAction,
  })

  return (
    <Suspense fallback={<div>Loading favorite workouts...</div>}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* Pass only the query key */}
        <WorkoutFilterLayout
          queryKey={favoritesQueryKey}
        />
      </HydrationBoundary>
    </Suspense>
  )
}
