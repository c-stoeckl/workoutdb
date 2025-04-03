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
    likesCount: 12,
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
    likesCount: 8,
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
    likesCount: 15,
  },
  {
    id: 4,
    name: "4-7-8 breathing",
    duration: 15,
    type: "Breathwork",
    description: "A 15-minute breathwork routine to calm your mind and body.",
    routine: `1. Exhale all of the air out of your lungs.
2. Inhale through your nose for a count of 4.
3. Hold your breath for a count of 7.
4. Breathe out through your mouth for a count of 8, making a “whoosh” sound with your mouth.
5. Repeat these steps up to 4 times.`,
    likesCount: 10,
  },
  {
    id: 5,
    name: "HYROX",
    duration: 30,
    type: "HYROX",
    description:
      "A unique blend of running and functional workouts, repeated eight times. Estimated time: 90 minutes.",
    routine: `1 KM RUN
1000 m SkiErg
1 KM RUN
2×25 m Sled Push (152 kg incl. Sled)
1 KM RUN
2×25 m Sled Pull (103 kg incl. Sled)
1 KM RUN
80m Burpee Broad Jump
1 KM RUN
1000 m Rowing
1 KM RUN
200 m Kettle Bells Farmers Carry (2×24 kg)
1 KM RUN
100 m Sandbag Lunges (20 kg)
1 KM RUN
100 x Wall Balls (6 kg)`,
    likesCount: 52,
  },
]
