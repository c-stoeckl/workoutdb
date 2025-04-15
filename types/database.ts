export type WeightUnit = 'kg' | 'lbs';
export type SessionStatus = 'started' | 'completed' | 'abandoned';

export interface WorkoutType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  type_id: string;
  user_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  description?: string;
  video_url?: string;
  primary_muscle_group?: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_definition_id: string;
  sets?: number;
  reps?: string;
  weight?: number;
  weight_unit?: WeightUnit;
  duration?: string;
  rest_period?: string;
  order: number;
  notes?: string;
  created_at: string;
  exercise_definition?: ExerciseDefinition;
}

export interface Favorite {
  id: string;
  user_id: string;
  workout_id: string;
  created_at: string;
}

// Extended types for UI with relationships
export interface WorkoutWithDetails extends Workout {
  type: WorkoutType;
  exercises: WorkoutExercise[];
  favorites_count: number;
  is_favorited?: boolean; // Used for UI state
}
