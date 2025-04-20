// /Users/cstoeckl/projects/workoutsdb/app/actions/workout-actions.ts
"use server"; // Marks this module's exports as Server Actions

import { createClient } from "@/utils/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { toggleFavorite } from "@/services/workouts"; // Import the service function

/**
 * Server Action to toggle the favorite status of a workout for the logged-in user.
 * Calls the toggleFavorite service function and revalidates relevant cache tags.
 * @param workoutId The ID of the workout to toggle.
 * @returns The new favorite status (true if favorited, false if unfavorited).
 * @throws Error if the user is not authenticated or if the toggle operation fails.
 */
export async function toggleFavoriteAction(
    workoutId: string,
): Promise<boolean> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Authentication required: User is not logged in.");
    }

    try {
        // Call the service function
        const isFavorited = await toggleFavorite(workoutId, user.id);

        // Revalidate caches on success
        // Note: 'workout-detail' might need refinement if its cache key depends on the ID.
        // For now, revalidating the general tag is a safe approach.
        // If specific workout detail pages use unstable_cache keyed by ID AND user,
        // revalidating this tag might not be enough, and revalidatePath might be needed.
        revalidateTag("workouts"); // List of all workouts
        revalidateTag("favorites"); // List of favorite workouts
        revalidateTag("workout-detail"); // Individual workout details (if using this tag)

        // Explicitly revalidate the page displaying the workouts
        revalidatePath("/workouts");

        return isFavorited;
    } catch (error: unknown) {
        console.error(
            `Server Action Error: Failed to toggle favorite for workout ${workoutId}:`,
            error,
        );
        let errorMessage = "An unknown error occurred.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        // Optionally, re-throw a more user-friendly error or return a specific error state
        throw new Error(`Failed to update favorite status. ${errorMessage}`);
    }
}
