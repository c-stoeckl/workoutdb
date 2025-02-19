import { Suspense } from "react"
import { WorkoutFilterLayout } from "@/components/workout-filter-layout"
import { workouts } from "@/data/workouts"

export default function WorkoutsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkoutFilterLayout allWorkouts={workouts} />
    </Suspense>
  )
}
