import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { notFound } from "next/navigation"
import { workouts } from "@/data/workouts"

// Server Action for fetching workout data
// async function getWorkout(id: string) {
//   try {
//     // Replace with your actual data fetching logic
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/workouts/${id}`,
//       {
//         // Next.js 15 cache behavior
//         next: {
//           revalidate: 60, // Revalidate every minute
//           tags: [`workout-${id}`], // Tag for on-demand revalidation
//         },
//       }
//     )

//     if (!res.ok) {
//       return null
//     }

//     return res.json()
//   } catch (error) {
//     console.error("Error fetching workout:", error)
//     return null
//   }
// }

export default async function WorkoutPage({
  params,
}: {
  params: { id: string }
}) {
  const workout = workouts.find((w) => w.id === parseInt(params.id))

  if (!workout) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
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
