import type { WorkoutWithDetails } from "@/types/database";

// --- Canonical mapping logic and types ---
export type RawWorkout = {
  id: string;
  name: string;
  description: string | null;
  type_id: string;
  created_by: string;
  created_at: string;
  updated_at: string | null;
  type: {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
  } | {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
  }[] | null;
  workout_exercises:
    | Array<{
      id: string;
      workout_id: string;
      exercise_definition_id: string;
      sets: number | null;
      reps: string | null;
      weight: number | null;
      weight_unit: "kg" | "lbs" | null;
      duration: string | null;
      rest_period: string | null;
      order: number;
      notes: string | null;
      created_at: string;
      exercise_definition: {
        id: string;
        name: string;
        description: string | null;
        video_url: string | null;
        primary_muscle_group: string | null;
      } | null;
    }>
    | null;
  favorites?: Array<{ count: number }>;
};

export function mapRawWorkouts(
  data: RawWorkout[],
  user: { id: string } | null,
  userFavorites: Set<string>,
): WorkoutWithDetails[] {
  return data.map((raw: RawWorkout) => {
    // Normalize type relation (array or object)
    let typeObj: {
      id: string;
      name: string;
      description: string | null;
      created_at: string;
    } | undefined = undefined;
    if (raw.type) {
      if (Array.isArray(raw.type)) {
        if (raw.type.length > 0) {
          typeObj = raw.type[0];
        }
      } else {
        typeObj = raw.type;
      }
    }
    const type = typeObj
      ? {
        id: typeObj.id,
        name: typeObj.name,
        description: typeObj.description ?? undefined,
        created_at: typeObj.created_at,
      }
      : {
        id: "unknown",
        name: "Unknown",
        created_at: raw.created_at,
      };

    // Normalize exercises
    const exercises = (raw.workout_exercises ?? []).map(
      (ex: NonNullable<RawWorkout["workout_exercises"]>[number]) => {
        const def = ex.exercise_definition;
        return {
          id: ex.id,
          workout_id: ex.workout_id,
          exercise_definition_id: ex.exercise_definition_id,
          sets: ex.sets ?? undefined,
          reps: ex.reps ?? undefined,
          weight: ex.weight ?? undefined,
          weight_unit: ex.weight_unit ?? undefined,
          duration: ex.duration ?? undefined,
          rest_period: ex.rest_period ?? undefined,
          order: ex.order,
          notes: ex.notes ?? undefined,
          created_at: ex.created_at,
          exercise_definition: def
            ? {
                id: def.id,
                name: def.name,
                description: def.description ?? undefined,
                video_url: def.video_url ?? undefined,
                primary_muscle_group: def.primary_muscle_group ?? undefined,
              }
            : undefined,
        };
      },
    );

    const is_favorited = user ? userFavorites.has(raw.id) : false;

    return {
      id: raw.id,
      name: raw.name,
      description: raw.description ?? undefined,
      type_id: raw.type_id,
      user_id: raw.created_by,
      is_public: true, // Assume all fetched are public
      created_at: raw.created_at,
      updated_at: raw.updated_at ?? raw.created_at,
      type,
      exercises,
      favorites_count: raw.favorites?.[0]?.count ?? 0,
      is_favorited,
    };
  });
}
