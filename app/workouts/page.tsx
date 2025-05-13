import { Suspense } from "react"
import { WorkoutFilterLayout } from "@/components/workout-filter-layout"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import getQueryClient from "@/lib/get-query-client"
import { fetchWorkoutsSSR, workoutsQueryKey } from "@/hooks/use-workouts-server"

export default async function WorkoutsPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: workoutsQueryKey,
    queryFn: fetchWorkoutsSSR,
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<div>Loading workouts...</div>}>
        <WorkoutFilterLayout />
      </Suspense>
    </HydrationBoundary>
  )
}
