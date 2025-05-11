'use server';

import { createClient } from "@/utils/supabase/server";
import type { WorkoutWithDetails, WorkoutType, ExerciseDefinition, WorkoutExercise, WeightUnit } from "@/types/database";

interface RawWorkoutFromAction {
  id: string;
  name: string;
  description: string | null;
  type_id: string;
  created_by: string;
  created_at: string;
  updated_at: string | null;
  type: Array<{ 
    id: string;
    name: string;
    created_at: string;
  }> | null;
  workout_exercises: Array<{ 
    id: string;
    workout_id: string;
    exercise_definition_id: string;
    sets: number | null;
    reps: string | null;       
    weight: number | null;
    weight_unit: string | null;
    duration: string | null;     
    rest_period: string | null;  
    order: number | null;
    notes: string | null;
    exercise_definition: { 
      id: string;
      name: string;
      description: string | null;
      video_url: string | null;
      primary_muscle_group: string | null;
    } | null; 
  }> | null; 
  favorites: Array<{ count: number }>; 
}

const WORKOUT_SELECT = `
  id,
  name,
  description,
  type_id,
  created_by,
  created_at,
  updated_at,
  type:workout_types(id, name, created_at),
  workout_exercises(
    *,
    exercise_definition:exercise_definitions(*)  
  ),
  favorites:favorites(count)  
` as const;

export async function getFavoriteWorkoutsAction(): Promise<WorkoutWithDetails[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Must be logged in to view favorites");
  }

  const { data: favorites, error: favError } = await supabase
    .from("favorites")
    .select("workout_id")
    .eq("user_id", user.id);

  if (favError) {
    console.error("Error fetching favorite IDs:", favError);
    throw new Error(`Error fetching favorites: ${favError.message}`);
  }

  if (!favorites.length) {
    return [];
  }

  const { data: workouts, error: workoutsError } = await supabase
    .from("workouts")
    .select(WORKOUT_SELECT)
    .in("id", favorites.map(f => f.workout_id));

  if (workoutsError) {
    console.error("Error fetching workouts:", workoutsError);
    throw new Error(`Error fetching workouts: ${workoutsError.message}`);
  }

  const defaultType: WorkoutType = {
    id: "unknown",
    name: "Unknown",
    created_at: new Date().toISOString(),
    description: undefined, 
  };

  return (workouts as RawWorkoutFromAction[]).map((workout): WorkoutWithDetails => {
    const mappedExercises: WorkoutExercise[] = workout.workout_exercises?.map(ex => {
      const definition: ExerciseDefinition | null = ex.exercise_definition ? {
        id: ex.exercise_definition.id,
        name: ex.exercise_definition.name,
        description: ex.exercise_definition.description ?? undefined,
        video_url: ex.exercise_definition.video_url ?? undefined,
        primary_muscle_group: ex.exercise_definition.primary_muscle_group ?? undefined,
      } : null;

      return {
        id: ex.id,
        workout_id: workout.id, 
        exercise_definition_id: ex.exercise_definition_id,
        sets: ex.sets ?? undefined,
        reps: ex.reps ?? undefined,
        weight: ex.weight ?? undefined,
        weight_unit: (ex.weight_unit ?? undefined) as WeightUnit | undefined,
        duration: ex.duration ?? undefined,
        rest_period: ex.rest_period ?? undefined,
        order: ex.order ?? 0, 
        notes: ex.notes ?? undefined,
        created_at: workout.created_at, 
        exercise_definition: definition ?? undefined, 
      };
    }) ?? [];

    const mappedType: WorkoutType | null = workout.type?.[0] ? {
      id: workout.type[0].id,
      name: workout.type[0].name,
      created_at: workout.type[0].created_at,
      description: undefined, 
    } : null;

    return {
      id: workout.id,
      name: workout.name,
      description: workout.description ?? undefined,
      type_id: workout.type_id,
      user_id: workout.created_by,
      is_public: true, 
      created_at: workout.created_at,
      updated_at: workout.updated_at ?? workout.created_at,
      type: mappedType ?? defaultType,
      exercises: mappedExercises, 
      favorites_count: workout.favorites?.[0]?.count ?? 0,
      is_favorited: true, 
    };
  });
}

export async function toggleFavoriteAction(workoutId: string, isCurrentlyFavorited: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Must be logged in to toggle favorites")
  }

  try {
    if (isCurrentlyFavorited) {
      const { error: deleteError } = await supabase
        .from("favorites")
        .delete()
        .eq("workout_id", workoutId)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Error removing favorite:", deleteError);
        throw new Error(`Failed to unfavorite workout: ${deleteError.message}`);
      }
      return false; 
    } else {
      const { error: insertError } = await supabase
        .from("favorites")
        .insert({ workout_id: workoutId, user_id: user.id });

      if (insertError) {
        console.error("Error inserting favorite:", insertError);
        throw new Error(`Failed to favorite workout: ${insertError.message}`);
      }
      return true; 
    }
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    throw new Error("An unexpected error occurred while toggling favorite status.");
  }
}
