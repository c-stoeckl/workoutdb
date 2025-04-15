import { Suspense } from "react"
import { WorkoutFilterLayout } from "@/components/workout-filter-layout"
import { getFavoriteWorkouts } from "@/services/workouts"

export default async function FavoritesPage() {
  const workouts = await getFavoriteWorkouts()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkoutFilterLayout allWorkouts={workouts} />
    </Suspense>
  )
}
