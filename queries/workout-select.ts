// Centralized select string for fetching a workout with all details (type, exercises, favorites)
// Use this in all Supabase queries that need the canonical workout shape

export const WORKOUT_SELECT = `
  id,
  name,
  description,
  type_id,
  created_by,
  created_at,
  updated_at,
  type:workout_types!workouts_type_id_fkey(id, name, description, created_at),
  workout_exercises(
    *,
    exercise_definition:exercise_definitions(*)
  ),
  favorites:favorites(count)
` as const;
