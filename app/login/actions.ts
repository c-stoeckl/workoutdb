"use server"

import { headers } from "next/headers"

import { createClient } from "@/utils/supabase/server"

export async function signInWithMagicLink(formData: FormData) {
  const email = formData.get("email") as string
  const supabase = await createClient() // Use server client

  if (!email) {
    return { error: { message: "Email is required." } }
  }

  // Get the redirect URL from headers or environment variables
  const headerList = await headers()
  const origin = headerList.get("origin")
  // Ensure the confirm path matches your actual confirmation route setup
  const emailRedirectTo = origin ? `${origin}/auth/confirm` : undefined

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, // Allow users to sign up via magic link - uncomment if needed
      emailRedirectTo,
    },
  })

  if (error) {
    console.error("Magic link sign-in error:", error)
    // Return a serializable error object for the client form
    return { error: { message: error.message || "Could not send magic link." } }
  }

  // Successfully initiated OTP flow. No redirect here.
  // The client will show a message.
  return { data, error: null }
}
