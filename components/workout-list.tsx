import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Workout } from "@/types/workout"
import React, { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import Link from "next/link"

interface WorkoutListProps {
  workouts: Workout[]
}

export function WorkoutList({ workouts }: WorkoutListProps) {
  // State to track user favorites
  const [favorites, setFavorites] = useState<number[]>([])
  const [workoutData, setWorkoutData] = useState<Workout[]>(workouts)

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("workout-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Update workoutData when workouts prop changes
  useEffect(() => {
    setWorkoutData(workouts)
  }, [workouts])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("workout-favorites", JSON.stringify(favorites))
  }, [favorites])

  // Toggle favorite status for a workout
  const toggleFavorite = (workoutId: number) => {
    setWorkoutData((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              likesCount: favorites.includes(workoutId)
                ? workout.likesCount - 1
                : workout.likesCount + 1,
            }
          : workout
      )
    )

    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(workoutId)) {
        return prevFavorites.filter((id) => id !== workoutId)
      } else {
        return [...prevFavorites, workoutId]
      }
    })
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
                favorites.includes(workout.id)
                  ? "fill-red-500 stroke-red-500"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleFavorite(workout.id)
              }}
            >
              <span className="text-sm font-medium">{workout.likesCount}</span>
              <Heart
                strokeWidth={1.5}
                fill={favorites.includes(workout.id) ? "fill-red-500" : "none"}
                stroke={
                  favorites.includes(workout.id)
                    ? "stroke-red-500"
                    : "currentColor"
                }
              />
            </Button>

            <CardHeader>
              <CardTitle>{workout.name}</CardTitle>
              <CardDescription>{workout.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="max-h-48 overflow-y-auto">{workout.routine}</pre>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
