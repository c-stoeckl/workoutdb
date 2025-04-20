import { Suspense } from "react"
import { WorkoutFilterLayout } from "@/components/workout-filter-layout"; 
import { getWorkouts } from "@/services/workouts";
import { createClient } from "@/utils/supabase/server";

export default async function WorkoutsPage() {
  const supabase = await createClient(); 
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  const workouts = await getWorkouts(supabase, userId);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkoutFilterLayout allWorkouts={workouts} />
    </Suspense>
  )
}
