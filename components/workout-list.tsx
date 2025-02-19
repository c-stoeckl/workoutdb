import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Workout } from "@/types/workout"
import React from "react"

interface WorkoutListProps {
  workouts: Workout[]
}

export function WorkoutList({ workouts }: WorkoutListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {workouts.map((workout) => (
        <Card key={workout.id}>
          <CardHeader>
            <CardTitle>{workout.name}</CardTitle>
            <CardDescription>{workout.description}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-scroll">
            <pre>{workout.routine}</pre>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
