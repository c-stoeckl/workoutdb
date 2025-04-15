import { NextRequest, NextResponse } from "next/server"
import { getWorkout, toggleFavorite } from "@/services/workouts"
import { createClient } from "@/utils/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workout = await getWorkout(params.id)
    return NextResponse.json(workout)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch workout" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const isFavorited = await toggleFavorite(params.id, user.id)
    return NextResponse.json({ isFavorited })
  } catch {
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    )
  }
}
