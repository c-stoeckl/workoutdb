"use client"

import React from "react"
import { WorkoutWithDetails } from "@/types/database"
import { WorkoutCard } from "./workout-card"

interface WorkoutListProps {
  workouts: WorkoutWithDetails[]
}

export function WorkoutList({ workouts }: WorkoutListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {workouts.map((workout: WorkoutWithDetails) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
        />
      ))}
    </div>
  )
}
