import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { notFound } from "next/navigation"
import { workouts } from "@/data/workouts"
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
  // Await the params before using them
  const { id } = await params
  const workout = workouts.find((w) => w.id === parseInt(id))

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
          <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted p-4">
            {workout.routine}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

// Generate static params for static generation
export async function generateStaticParams() {
  return workouts.map((workout) => ({
    id: workout.id.toString(),
  }))
}
