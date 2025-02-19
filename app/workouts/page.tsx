import { WorkoutFilterLayout } from "@/components/workout-filter-layout"
import { workouts } from "@/data/workouts"

export default function WorkoutsPage() {
  return <WorkoutFilterLayout allWorkouts={workouts} />
}
