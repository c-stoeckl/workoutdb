import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { notFound } from "next/navigation"
import { getWorkout } from "@/services/workouts"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Define the props type with Promise for params
interface WorkoutPageProps {
  params: Promise<{ id: string }>
}

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const { id } = await params

  try {
    const workout = await getWorkout(id)

    if (!workout) {
      notFound()
    }

    return (
      <div className="container mx-auto p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/workouts">Workouts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{workout.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{workout.name}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {workout.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Type</h3>
                <p className="text-muted-foreground">{workout.type.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Exercises</h3>
                <div className="space-y-4">
                  {workout.exercises
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((exercise) => (
                      <div
                        key={exercise.id}
                        className="rounded-lg bg-muted p-4"
                      >
                        <h4 className="font-medium">
                          {exercise.exercise_definition?.name}
                        </h4>
                        <div className="mt-2 text-sm text-muted-foreground space-y-1">
                          {exercise.sets && <p>Sets: {exercise.sets}</p>}
                          {exercise.reps && <p>Reps: {exercise.reps}</p>}
                          {exercise.weight && (
                            <p>
                              Weight: {exercise.weight} {exercise.weight_unit}
                            </p>
                          )}
                          {exercise.duration && (
                            <p>Duration: {exercise.duration}</p>
                          )}
                          {exercise.rest_period && (
                            <p>Rest: {exercise.rest_period}</p>
                          )}
                          {exercise.notes && (
                            <p className="mt-2 italic">{exercise.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch {
    notFound()
  }
}
