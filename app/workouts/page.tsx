import { Suspense } from "react"
import { WorkoutFilterLayout } from "@/components/workout-filter-layout"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import getQueryClient from "@/lib/get-query-client"
import { fetchWorkouts, workoutsQueryKey } from "@/hooks/use-workouts"

export default async function WorkoutsPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: workoutsQueryKey,
    queryFn: fetchWorkouts,
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<div>Loading workouts...</div>}>
        {/* Pass only the query key, queryFn is not needed for hydration */}
        <WorkoutFilterLayout
          queryKey={workoutsQueryKey}
        />
      </Suspense>
    </HydrationBoundary>
  )
}
