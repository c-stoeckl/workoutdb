import Link from "next/link"
import React from "react"
import { Heart } from "lucide-react"
import { WorkoutWithDetails } from "@/types/database"
import { useToggleFavorite } from "@/hooks/use-toggle-favorite"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface WorkoutCardProps {
  workout: WorkoutWithDetails
}

/**
 * Renders a single workout card with details and a favorite button.
 * Uses useToggleFavorite hook for mutation and optimistic updates.
 */
export function WorkoutCard({ workout }: WorkoutCardProps) {
  const { mutate: toggleFavorite, isPending } = useToggleFavorite()

  const handleFavoriteToggle = () => {
    toggleFavorite({
      workoutId: workout.id,
      isCurrentlyFavorited: workout.is_favorited ?? false,
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
            workout.is_favorited ? "text-red-500" : ""
          }`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleFavoriteToggle()
          }}
          disabled={isPending}
        >
          <span className="text-sm font-medium">
            {workout.favorites_count ?? 0}
          </span>
          <Heart
            strokeWidth={1.5}
            className={
              workout.is_favorited ? "fill-current text-red-500" : "fill-none"
            }
          />
        </Button>

        <CardHeader>
          <CardTitle>{workout.name}</CardTitle>
          <CardDescription>
            {workout.type?.name ?? "Unknown Type"} • {workout.exercises.length}{" "}
            exercises
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
