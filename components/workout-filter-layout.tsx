"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { WorkoutList } from "@/components/workout-list"
import type { WorkoutWithDetails } from "@/types/database"
import { workoutConfig, type WorkoutCategory } from "@/types/workout"

interface WorkoutFilterLayoutProps {
  allWorkouts: WorkoutWithDetails[]
}

export function WorkoutFilterLayout({ allWorkouts }: WorkoutFilterLayoutProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedType = searchParams.get("type") as WorkoutCategory | null

  const availableWorkoutTypes = [
    ...new Set(allWorkouts.map((w) => w.type.name)),
  ].filter((type): type is WorkoutCategory => type in workoutConfig)

  const filteredWorkouts = selectedType
    ? allWorkouts.filter((w) => w.type.name === selectedType)
    : allWorkouts

  return (
    <div className="flex flex-col">
      <ScrollArea className="w-full whitespace-nowrap border-y">
        <div className="flex w-max space-x-2 p-2 px-4">
          <Button
            variant={selectedType ? "outline" : "default"}
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              params.delete("type")
              router.push(`?${params.toString()}`)
            }}
          >
            All
          </Button>
          {availableWorkoutTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.set("type", type)
                router.push(`?${params.toString()}`)
              }}
            >
              {workoutConfig[type].label}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <WorkoutList workouts={filteredWorkouts} />
    </div>
  )
}
