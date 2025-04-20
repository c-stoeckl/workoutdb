import Link from "next/link"
import React, { useState, useTransition } from "react"
import { Heart } from "lucide-react"
import { WorkoutWithDetails } from "@/types/database"
import { toggleFavoriteAction } from "@/app/actions/workout-actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type OptimisticFavoriteUpdateFn = (action: {
  workoutId: string
  isCurrentlyFavorited: boolean
}) => void

interface WorkoutCardProps {
  workout: WorkoutWithDetails
  addOptimisticFavoriteUpdate: OptimisticFavoriteUpdateFn
}

/**
 * Renders a single workout card with details and a favorite button,
 * handling its own favorite toggle state and logic.
 */
export function WorkoutCard({
  workout,
  addOptimisticFavoriteUpdate,
}: WorkoutCardProps) {
  const [isPending, startTransition] = useTransition()
  const [localIsFavorited, setLocalIsFavorited] = useState(
    workout.is_favorited ?? false
  )
  const [localFavoritesCount, setLocalFavoritesCount] = useState(
    workout.favorites_count ?? 0
  )

  const handleFavoriteToggle = () => {
    startTransition(() => {
      const currentlyFavorited = localIsFavorited
      const newFavoritedState = !currentlyFavorited
      const newCount = localFavoritesCount + (newFavoritedState ? 1 : -1)

      setLocalIsFavorited(newFavoritedState)
      setLocalFavoritesCount(newCount)

      addOptimisticFavoriteUpdate({
        workoutId: workout.id,
        isCurrentlyFavorited: currentlyFavorited,
      })

      toggleFavoriteAction(workout.id).catch((err) => {
        console.error("Error toggling favorite:", err)
        setLocalIsFavorited(currentlyFavorited)
        setLocalFavoritesCount(localFavoritesCount)
      })
    })
  }

  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="flex transition-transform hover:scale-[1.02]"
    >
      <Card className="relative w-full flex flex-col">
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 right-4 flex items-center gap-1.5 p-0.5 z-20 hover:bg-transparent ${
            localIsFavorited ? "text-red-500" : ""
          }`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleFavoriteToggle()
          }}
          disabled={isPending}
        >
          <span className="text-sm font-medium">{localFavoritesCount}</span>
          <Heart
            strokeWidth={1.5}
            className={
              localIsFavorited ? "fill-current text-red-500" : "fill-none"
            }
          />
        </Button>

        <CardHeader>
          <CardTitle>{workout.name}</CardTitle>
          <CardDescription>
            {workout.type.name} • {workout.exercises.length} exercises
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {workout.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
