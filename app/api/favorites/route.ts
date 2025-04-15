import { NextResponse } from "next/server"
import { getFavoriteWorkouts } from "@/services/workouts"

export async function GET() {
  try {
    const workouts = await getFavoriteWorkouts()
    return NextResponse.json(workouts)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch favorite workouts" },
      { status: 500 }
    )
  }
}
