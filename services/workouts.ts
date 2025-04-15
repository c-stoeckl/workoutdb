import { createClient } from "@/utils/supabase/server"
import type { WorkoutWithDetails } from "@/types/database"
import { workoutConfig } from "@/types/workout"

const WORKOUT_SELECT_QUERY = `
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

export async function getFavoriteWorkouts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  // First get the user's favorited workout IDs
  const { data: favorites } = await supabase
    .from("favorites")
    .select("workout_id")
    .eq("user_id", user.id)

  if (!favorites?.length) {
    return []
  }

  // Then fetch the favorited workouts
  const { data: fetchedWorkouts, error } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT_QUERY)
    .order("created_at", { ascending: false })
    .in("id", favorites.map(f => f.workout_id))

  if (error) {
    throw new Error(`Error fetching favorite workouts: ${error.message}`)
  }

  // Transform fetched data
  return (fetchedWorkouts ?? [])
    .map((w) => ({
      id: w.id,
      name: w.name,
      description: w.description,
      type_id: w.type_id,
      user_id: w.created_by,
      is_public: true,
      created_at: w.created_at,
      updated_at: w.created_at,
      type: w.type ?? {
        id: "unknown",
        name: "Unknown",
        created_at: w.created_at,
      },
      exercises: w.workout_exercises ?? [],
      favorites_count: w.favorites?.[0]?.count ?? 0,
      is_favorited: true, // Since these are favorites, we know they're favorited
    }))
    .filter((w) => w.type && Object.keys(workoutConfig).includes(w.type.name))
}

export async function getWorkouts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch workouts with their types, exercises, and favorites count
  const { data: fetchedWorkouts, error } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT_QUERY)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Error fetching workouts: ${error.message}`)
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

  // Transform fetched data
  return (fetchedWorkouts ?? [])
    .map((w) => ({
      id: w.id,
      name: w.name,
      description: w.description,
      type_id: w.type_id,
      user_id: w.created_by,
      is_public: true,
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
}

export async function getWorkout(id: string): Promise<WorkoutWithDetails> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: workout, error } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT_QUERY)
    .eq("id", id)
    .single()

  if (error || !workout) {
    throw new Error(`Error fetching workout: ${error?.message ?? "Not found"}`)
  }

  // If user is logged in, check if they've favorited this workout
  let isFavorited = false
  if (user) {
    const { data: favorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("workout_id", id)
      .eq("user_id", user.id)
      .single()

    isFavorited = !!favorite
  }

  return {
    id: workout.id,
    name: workout.name,
    description: workout.description,
    type_id: workout.type_id,
    user_id: workout.created_by,
    is_public: true,
    created_at: workout.created_at,
    updated_at: workout.created_at,
    type: workout.type ?? {
      id: "unknown",
      name: "Unknown",
      created_at: workout.created_at,
    },
    exercises: workout.workout_exercises ?? [],
    favorites_count: workout.favorites?.[0]?.count ?? 0,
    is_favorited: isFavorited,
  }
}

export async function toggleFavorite(workoutId: string, userId: string) {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("workout_id", workoutId)
    .eq("user_id", userId)
    .single()

  if (existing) {
    await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id)
    return false
  } else {
    await supabase
      .from("favorites")
      .insert({ workout_id: workoutId, user_id: userId })
    return true
  }
}
