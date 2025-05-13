"use client"

import { useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { WorkoutList } from "@/components/workout-list"
import type { WorkoutWithDetails } from "@/types/database"
import { workoutConfig, type WorkoutCategory } from "@/types/workout"
import { useWorkouts } from "@/hooks/use-workouts-client"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Layout for filtering and displaying workouts, with optional favorites filtering.
 * @param filterFavoritesOnly - If true, only show favorited workouts
 */
export function WorkoutFilterLayout({
  filterFavoritesOnly = false,
}: {
  filterFavoritesOnly?: boolean
}) {
  const [selectedType, setSelectedType] = useState<WorkoutCategory | null>(null)

  const { data: workoutsData, isLoading, error } = useWorkouts()

  // Use workoutsData directly, as it now contains is_favorited and favorites_count
  const allWorkouts: WorkoutWithDetails[] = workoutsData ?? []

  // --- Favorites Filtering ---
  const filteredByFavorites = filterFavoritesOnly
    ? allWorkouts.filter((w) => w.is_favorited)
    : allWorkouts

  // --- Data Processing ---
  const availableWorkoutTypes: WorkoutCategory[] = [
    ...new Set(filteredByFavorites.map((w) => w.type?.name).filter(Boolean)),
  ].filter((type): type is WorkoutCategory => type in workoutConfig)

  const filteredWorkouts: WorkoutWithDetails[] = selectedType
    ? filteredByFavorites.filter((w) => w.type?.name === selectedType)
    : filteredByFavorites

  // --- Loading State ---
  if (isLoading) {
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

  // --- Empty State ---
  if (!isLoading && filteredWorkouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
        <span>
          No workouts found
          {selectedType
            ? ` for type: ${workoutConfig[selectedType]?.label || selectedType}`
            : ""}
          .
        </span>
      </div>
    )
  }

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

      {/* Workout Grid */}
      <WorkoutList workouts={filteredWorkouts} />
    </div>
  )
}
