import { Workout } from "@/types/workout"

export const workouts: Workout[] = [
  { id: 1, name: "Strength Training", duration: 45, type: "Strength" },
  { id: 2, name: "Yoga", duration: 30, type: "Yoga" },
  {
    id: 3,
    name: "HIIT",
    duration: 20,
    type: "HIIT",
    description: `400 meter Row
30 Wall Balls (20/14 lb)
400 meter Run
30 Burpees
400 meter Row
30 Sandbag Lunges (60/40 lb)
400 meter Run
30 Hand Release Push-Ups
400 meter Row
100 meter Farmer's Carry (2x50/35 lb)
400 meter Run
100 Sit-Ups`,
  },
]
