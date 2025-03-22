export const workoutTypes = [
  "Strength",
  "Cardio",
  "Yoga",
  "Pilates",
  "HIIT",
  "Stretch",
  "Barre",
  "Dance",
] as const

export type WorkoutType = (typeof workoutTypes)[number]

export interface Workout {
  id: number
  name: string
  duration: number
  type: WorkoutType
  description?: string
  routine: string
  likesCount: number
}
