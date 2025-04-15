import { NextResponse } from "next/server"
import { getWorkouts } from "@/services/workouts"

export async function GET() {
  try {
    const workouts = await getWorkouts()
    return NextResponse.json(workouts)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    )
  }
}
