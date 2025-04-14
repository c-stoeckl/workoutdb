"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function logout(): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error logging out:", error)
    // Optionally handle the error, maybe redirect with an error message
    // redirect('/login?error=Could not log out');
    // For now, we'll still redirect even if signout has an error server-side
  }

  // Redirect to the login page after sign out attempt
  redirect("/login")
  // No return value needed
}
