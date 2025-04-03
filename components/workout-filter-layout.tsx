"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { WorkoutList } from "@/components/workout-list"
import { workoutTypes } from "@/types/workout"
import { Workout } from "@/types/workout"

interface WorkoutFilterLayoutProps {
  allWorkouts: Workout[]
}

export function WorkoutFilterLayout({ allWorkouts }: WorkoutFilterLayoutProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedType = searchParams.get("type")

  const filteredWorkouts = selectedType
    ? allWorkouts.filter((w) => w.type === selectedType)
    : allWorkouts

  return (
    <>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-4">
          {workoutTypes.map((type, index) => (
            <Button
              key={index}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => {
                if (selectedType === type) {
                  router.push("?")
                } else {
                  router.push(`?type=${type}`)
                }
              }}
            >
              {type}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <WorkoutList workouts={filteredWorkouts} />
    </>
  )
}
