"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";

/**
 * Server Action to toggle the favorite status of a workout for the logged-in user.
 * Calls the toggleFavorite service function and revalidates relevant cache tags.
 * @param workoutId The ID of the workout to toggle.
 * @returns The new favorite status (true if favorited, false if unfavorited).
 * @throws Error if the user is not authenticated or if the toggle operation fails.
 */
export async function toggleFavoriteAction(
    workoutId: string,
    isCurrentlyFavorited: boolean
): Promise<{ success: boolean; isFavorited: boolean; error?: string }> {
    console.log('[toggleFavoriteAction] Server Action called.', { workoutId, isCurrentlyFavorited })

    // Use createClient directly within the action
    const supabase = await createClient()

    try {
        // Get user directly from the supabase client
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('[toggleFavoriteAction] Error fetching user:', userError)
            return { success: false, isFavorited: isCurrentlyFavorited, error: `Authentication error: ${userError.message}` }
        }
        if (!user) {
            console.error('[toggleFavoriteAction] User not authenticated.')
            return { success: false, isFavorited: isCurrentlyFavorited, error: 'User not authenticated' }
        }
        console.log(`[toggleFavoriteAction] Authenticated User ID: ${user.id}`);

        // --- Logic moved from toggleFavoriteService --- 
        let newFavoriteStatus: boolean;
        if (isCurrentlyFavorited) {
            // Remove from favorites
            console.log(`[toggleFavoriteAction] Removing favorite for workout ${workoutId} by user ${user.id}`);
            const { error } = await supabase
                .from('favorites')
                .delete()
                .match({ user_id: user.id, workout_id: workoutId });

            if (error) {
                console.error('[toggleFavoriteAction] Error removing favorite:', error);
                throw new Error(`Failed to remove favorite: ${error.message}`);
            }
            console.log(`[toggleFavoriteAction] Successfully removed favorite.`);
            newFavoriteStatus = false;
        } else {
            // Add to favorites
            console.log(`[toggleFavoriteAction] Adding favorite for workout ${workoutId} by user ${user.id}`);
            const { error } = await supabase
                .from('favorites')
                .insert({ user_id: user.id, workout_id: workoutId });

            if (error) {
                // Handle potential unique constraint violation if already favorited concurrently
                if (error.code === '23505') { // unique_violation
                    console.warn(`[toggleFavoriteAction] Favorite already exists for workout ${workoutId}, assuming success.`);
                    // Still treat as success, the state is now favorited
                } else {
                    console.error('[toggleFavoriteAction] Error adding favorite:', error);
                    throw new Error(`Failed to add favorite: ${error.message}`);
                }
            }
            console.log(`[toggleFavoriteAction] Successfully added favorite.`);
            newFavoriteStatus = true;
        }
        // --- End of moved logic --- 

        // Revalidate caches
        revalidateTag('workouts') // Tag used in getWorkouts (if defined there)
        revalidateTag('favorites') // Tag used in getFavoriteWorkouts

        return { success: true, isFavorited: newFavoriteStatus }
    } catch (error: unknown) {
        console.error('[toggleFavoriteAction] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to toggle favorite status.';
        return { success: false, isFavorited: isCurrentlyFavorited, error: errorMessage };
    }
}
