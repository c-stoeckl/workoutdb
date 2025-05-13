import {
  Activity,
  Dumbbell,
  Leaf,
  type LucideIcon,
  StretchHorizontal,
  Wind,
  Zap,
} from "lucide-react";

// UI configuration for workout types
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
  HIIT: {
    icon: Zap,
    label: "HIIT",
  },
  Functional: {
    icon: Zap,
    label: "Functional",
  },
  Flexibility: {
    icon: StretchHorizontal,
    label: "Flexibility",
  },
  Endurance: {
    icon: Wind,
    label: "Endurance",
  },
  Breathwork: {
    icon: Wind,
    label: "Breathwork",
  },
} as const;

// Type for workout categories
export type WorkoutCategory = keyof typeof workoutConfig;

// Map workout types to their icons
export const workoutTypeToIcon: Record<WorkoutCategory, LucideIcon> = Object
  .fromEntries(
    Object.entries(workoutConfig).map(([key, { icon }]) => [key, icon]),
  ) as Record<WorkoutCategory, LucideIcon>;

// Helper function to get workout type label
export const getWorkoutTypeLabel = (type: WorkoutCategory): string => {
  return workoutConfig[type].label;
};

// Helper function to get workout type icon
export const getWorkoutTypeIcon = (type: WorkoutCategory): LucideIcon => {
  return workoutTypeToIcon[type];
};
