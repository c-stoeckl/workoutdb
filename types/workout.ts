import {
  Dumbbell,
  Zap,
  Wind,
  StretchHorizontal,
  Leaf,
  Activity,
  type LucideIcon,
} from "lucide-react"

export const workoutConfig = {
  Strength: {
    icon: Dumbbell,
    label: "Strength",
  },
  Cardio: {
    icon: Activity,
    label: "Cardio",
  },
  Yoga: {
    icon: Leaf,
    label: "Yoga",
  },
  Pilates: {
    icon: StretchHorizontal,
    label: "Pilates",
  },
  HIIT: {
    icon: Zap,
    label: "HIIT",
  },
  Stretch: {
    icon: StretchHorizontal,
    label: "Stretch",
  },
  Breathwork: {
    icon: Wind,
    label: "Breathwork",
  },
  HYROX: {
    icon: Zap,
    label: "HYROX",
  },
} as const

export type WorkoutType = keyof typeof workoutConfig

export const workoutTypes = Object.keys(workoutConfig) as WorkoutType[]

export const workoutTypeToIcon: Record<WorkoutType, LucideIcon> =
  Object.fromEntries(
    Object.entries(workoutConfig).map(([key, value]) => [key, value.icon])
  ) as Record<WorkoutType, LucideIcon>

export interface Workout {
  id: number
  name: string
  duration: number
  type: WorkoutType
  description?: string
  routine: string
  likesCount: number
}
