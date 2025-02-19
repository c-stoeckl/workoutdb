import { Workout } from "@/types/workout"

export const workouts: Workout[] = [
  {
    id: 1,
    name: "Strength Training",
    duration: 45,
    type: "Strength",
    description: "A 45-minute strength training routine.",
    routine: `5x5 Squats
5x5 Bench Press
5x5 Deadlift
5x5 Overhead Press`,
  },
  {
    id: 2,
    name: "Yoga",
    duration: 30,
    type: "Yoga",
    description:
      "A 30-minute yoga routine to stretch and strengthen your body.",
    routine: `20s Downward Dog
20s Plank
20s Warrior Pose
20s Tree Pose
20s Cobra Pose
20s Boat Pose
20s Upward Dog`,
  },
  {
    id: 3,
    name: "HIIT",
    description: "A 20-minute high-intensity interval training routine.",
    duration: 20,
    type: "HIIT",
    routine: `400 meter Row
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
