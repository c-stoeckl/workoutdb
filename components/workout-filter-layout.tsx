"use client"

import { useOptimistic } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { WorkoutList } from "@/components/workout-list"
import type { WorkoutWithDetails } from "@/types/database"
import { workoutConfig, type WorkoutCategory } from "@/types/workout"
import Link from "next/link"

interface WorkoutFilterLayoutProps {
  allWorkouts: WorkoutWithDetails[]
}

// Type for the optimistic action payload
type OptimisticFavoriteAction = {
  workoutId: string
  isCurrentlyFavorited: boolean // Pass the state *before* the toggle
}

export function WorkoutFilterLayout({ allWorkouts }: WorkoutFilterLayoutProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedType = searchParams.get("type") as WorkoutCategory | null

  // Use useOptimistic hook to manage workout state optimistically
  const [optimisticWorkouts, addOptimisticFavoriteUpdate] = useOptimistic<
    WorkoutWithDetails[],
    OptimisticFavoriteAction
  >(
    allWorkouts, // Initial state from props
    // Update function: takes current state and action, returns new optimistic state
    (currentState, { workoutId, isCurrentlyFavorited }) => {
      return currentState.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              is_favorited: !isCurrentlyFavorited, // Optimistically toggle status
              favorites_count:
                (workout.favorites_count ?? 0) +
                (isCurrentlyFavorited ? -1 : 1), // Optimistically adjust count
            }
          : workout
      )
    }
  )

  const availableWorkoutTypes = [
    ...new Set(optimisticWorkouts.map((w) => w.type.name)),
  ].filter((type): type is WorkoutCategory => type in workoutConfig)

  const filteredWorkouts = selectedType
    ? optimisticWorkouts.filter((w) => w.type.name === selectedType)
    : optimisticWorkouts

  return (
    <div className="flex flex-col">
      <ScrollArea className="w-full whitespace-nowrap border-y">
        <div className="flex w-max space-x-2 p-2 px-4">
          <Button
            variant={selectedType ? "outline" : "default"}
            size="sm"
            asChild
          >
            <Link href={{ pathname }}>All</Link>
          </Button>
          {availableWorkoutTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={{ pathname, search: `?type=${type}` }}>
                {workoutConfig[type].label}
              </Link>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {/* Pass optimistic state and update function to WorkoutList */}
      <WorkoutList
        workouts={filteredWorkouts} // Pass optimistic workouts
        addOptimisticFavoriteUpdate={addOptimisticFavoriteUpdate} // Pass update fn
      />
    </div>
  )
}
