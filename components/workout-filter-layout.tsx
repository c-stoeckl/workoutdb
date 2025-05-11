"use client"

import { useState } from "react"
import { useQuery, type QueryKey } from "@tanstack/react-query"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { WorkoutList } from "@/components/workout-list"
import type { WorkoutWithDetails } from "@/types/database"
import { workoutConfig, type WorkoutCategory } from "@/types/workout"
import { fetchWorkouts } from "@/hooks/use-workouts"
import { Skeleton } from "@/components/ui/skeleton"

interface WorkoutFilterLayoutProps {
  queryKey: QueryKey
}

export function WorkoutFilterLayout({ queryKey }: WorkoutFilterLayoutProps) {
  const [selectedType, setSelectedType] = useState<WorkoutCategory | null>(null)

  const {
    data: workoutsData,
    isLoading,
    error,
  } = useQuery<WorkoutWithDetails[]>({
    queryKey: queryKey,
    queryFn: fetchWorkouts,
  })

  const allWorkouts = workoutsData

  // --- Loading State ---
  if (isLoading && !allWorkouts) {
    return (
      <div className="flex flex-col space-y-4 p-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-red-500">Error loading workouts: {error.message}</p>
      </div>
    )
  }

  // --- Data Processing ---
  const availableWorkoutTypes = [
    ...new Set((allWorkouts ?? []).map((w) => w.type.name)),
  ].filter((type): type is WorkoutCategory => type in workoutConfig)

  const filteredWorkouts = selectedType
    ? (allWorkouts ?? []).filter((w) => w.type.name === selectedType)
    : allWorkouts ?? []

  // --- Render Layout ---
  return (
    <div className="flex flex-col">
      {/* Filter Buttons */}
      <ScrollArea className="w-full whitespace-nowrap border-y mb-6">
        <div className="flex w-max space-x-2 p-2 px-4">
          <Button
            variant={selectedType === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(null)}
          >
            All
          </Button>
          {availableWorkoutTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {workoutConfig[type]?.label || type}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Workout Grid or Message */}
      {filteredWorkouts.length === 0 ? (
        <div className="text-center text-gray-500">
          No workouts found
          {selectedType
            ? ` for type: ${workoutConfig[selectedType]?.label || selectedType}`
            : ""}
          .
        </div>
      ) : (
        <WorkoutList workouts={filteredWorkouts} />
      )}
    </div>
  )
}
