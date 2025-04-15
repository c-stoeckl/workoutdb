import { Suspense } from "react"
import { WorkoutFilterLayout } from "@/components/workout-filter-layout"
import { createClient } from "@/utils/supabase/server"
import { workoutConfig } from "@/types/workout"
import type { WorkoutWithDetails } from "@/types/database"

export default async function WorkoutsPage() {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch workouts with their types, exercises, and favorites count
  const { data: fetchedWorkouts, error } = await supabase
    .from("workouts")
    .select(
      `
      *,
      type:workout_types(id, name, created_at),
      workout_exercises(
        id,
        sets,
        reps,
        weight,
        weight_unit,
        duration,
        rest_period,
        order,
        notes,
        exercise_definition:exercise_definitions(
          id,
          name,
          description,
          video_url,
          primary_muscle_group
        )
      ),
      favorites:favorites(count)
    `
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching workouts:", error)
    return <div>Error loading workouts</div>
  }

  // If user is logged in, fetch their favorites
  let userFavorites: Set<string> = new Set()
  if (user) {
    const { data: favorites } = await supabase
      .from("favorites")
      .select("workout_id")
      .eq("user_id", user.id)

    if (favorites) {
      userFavorites = new Set(favorites.map((f) => f.workout_id))
    }
  }

  // Transform fetched data to match WorkoutWithDetails type
  const workouts: WorkoutWithDetails[] = (fetchedWorkouts ?? [])
    .map((w) => ({
      id: w.id,
      name: w.name,
      description: w.description,
      type_id: w.type_id,
      user_id: w.created_by,
      is_public: true, // TODO: Add is_public column to schema
      created_at: w.created_at,
      updated_at: w.created_at,
      type: w.type ?? {
        id: "unknown",
        name: "Unknown",
        created_at: w.created_at,
      },
      exercises: w.workout_exercises ?? [],
      favorites_count: w.favorites?.[0]?.count ?? 0,
      is_favorited: userFavorites.has(w.id),
    }))
    .filter((w) => w.type && Object.keys(workoutConfig).includes(w.type.name))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkoutFilterLayout allWorkouts={workouts} />
    </Suspense>
  )
}
