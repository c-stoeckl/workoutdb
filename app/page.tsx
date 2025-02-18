import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { WorkoutList } from "@/components/workout-list"
import { workoutTypes } from "@/types/workout"
import { workouts } from "@/data/workouts"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <ScrollArea className="w-full whitespace-nowrap mt-14">
        <div className="flex w-max space-x-2 p-4">
          {workoutTypes.map((type, index) => (
            <Button key={index} variant="outline">
              {type}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <WorkoutList workouts={workouts} />
    </div>
  )
}
