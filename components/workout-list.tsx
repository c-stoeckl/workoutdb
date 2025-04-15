"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import Link from "next/link"
import { WorkoutWithDetails } from "@/types/database"
import { createClient } from "@/utils/supabase/client"

interface WorkoutListProps {
  workouts: WorkoutWithDetails[]
}

export function WorkoutList({ workouts }: WorkoutListProps) {
  const [workoutData, setWorkoutData] = useState<WorkoutWithDetails[]>(workouts)
  const supabase = createClient()

  // Update workoutData when workouts prop changes
  useEffect(() => {
    setWorkoutData(workouts)
  }, [workouts])

  // Toggle favorite status for a workout
  const toggleFavorite = async (workoutId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Handle unauthenticated user
        console.log("Please log in to favorite workouts")
        return
      }

      const workout = workoutData.find(w => w.id === workoutId)
      if (!workout) return

      // Optimistically update UI
      setWorkoutData((prevWorkouts) =>
        prevWorkouts.map((w) =>
          w.id === workoutId
            ? {
                ...w,
                is_favorited: !w.is_favorited,
                favorites_count: (w.favorites_count ?? 0) + (w.is_favorited ? -1 : 1)
              }
            : w
        )
      )

      if (workout.is_favorited) {
        // Remove favorite
        await supabase
          .from('favorites')
          .delete()
          .match({ workout_id: workoutId, user_id: user.id })
      } else {
        // Add favorite
        await supabase
          .from('favorites')
          .insert({ workout_id: workoutId, user_id: user.id })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Revert optimistic update on error
      setWorkoutData(workouts)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {workoutData.map((workout) => (
        <Link
          key={workout.id}
          href={`/workouts/${workout.id}`}
          className="flex transition-transform hover:scale-[1.02]"
        >
          <Card className="relative w-full">
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-4 right-4 flex items-center gap-1.5 p-0.5 z-20 hover:bg-transparent ${
                workout.is_favorited ? "text-red-500" : ""
              }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void toggleFavorite(workout.id)
              }}
            >
              <span className="text-sm font-medium">
                {workout.favorites_count ?? 0}
              </span>
              <Heart
                strokeWidth={1.5}
                className={workout.is_favorited ? "fill-current" : "fill-none"}
              />
            </Button>

            <CardHeader>
              <CardTitle>{workout.name}</CardTitle>
              <CardDescription>
                {workout.type.name} • {workout.exercises.length} exercises
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {workout.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
