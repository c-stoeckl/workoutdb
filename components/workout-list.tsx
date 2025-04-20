"use client"

import React, { useEffect, useState } from "react"
import { WorkoutWithDetails } from "@/types/database"
import { WorkoutCard } from "./workout-card"

type OptimisticFavoriteUpdateFn = (action: {
  workoutId: string
  isCurrentlyFavorited: boolean
}) => void

interface WorkoutListProps {
  workouts: WorkoutWithDetails[]
  addOptimisticFavoriteUpdate: OptimisticFavoriteUpdateFn
}

export function WorkoutList({
  workouts,
  addOptimisticFavoriteUpdate,
}: WorkoutListProps) {
  const [workoutData, setWorkoutData] = useState<WorkoutWithDetails[]>(workouts)

  useEffect(() => {
    setWorkoutData(workouts)
  }, [workouts])

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {workoutData.map((workout: WorkoutWithDetails) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          addOptimisticFavoriteUpdate={addOptimisticFavoriteUpdate}
        />
      ))}
    </div>
  )
}
