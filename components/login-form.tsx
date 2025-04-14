"use client"

import { useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import { signInWithMagicLink } from "@/app/login/actions"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null) // Track which OAuth is loading

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
      "http://localhost:3000/"
    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.endsWith("/") ? url : `${url}/`
    return url
  }

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setIsLoading(true)

    const formData = new FormData()
    formData.append("email", email)

    const { error } = await signInWithMagicLink(formData)

    setIsLoading(false)

    if (error) {
      console.error("Magic link error:", error)
      setError(error.message || "Could not send magic link.")
      return
    }

    setMessage("Check your email for the magic login link!")
    setEmail("") // Clear email field after sending
  }

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    setError(null)
    setMessage(null)
    setIsOAuthLoading(provider)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getURL(),
      },
    })

    setIsOAuthLoading(null) // Stop loading indicator if error occurs before redirect

    if (oauthError) {
      console.error(`${provider} OAuth error:`, oauthError)
      setError(oauthError.message || `Could not authenticate with ${provider}.`)
    }
    // No explicit redirect needed here, Supabase handles it
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleMagicLink}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex items-center justify-center gap-2">
                <Icons.logo className="size-6" />
                <span className="font-semibold lg:inline-block">
                  {siteConfig.name}
                </span>
              </div>
              <span className="sr-only">{siteConfig.name}</span>
            </Link>
            <h1 className="text-xl font-bold">Sign in or Sign up</h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || !!isOAuthLoading}
              />
            </div>
            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}
            {message && (
              <p className="text-foreground text-sm text-center">{message}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !!isOAuthLoading}
            >
              {isLoading ? "Sending link..." : "Continue with Email"}
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={() => handleOAuthSignIn("apple")}
              disabled={!!isOAuthLoading || isLoading}
            >
              {isOAuthLoading === "apple" ? (
                "Redirecting..." // Add a spinner icon later if desired
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Apple
                </>
              )}
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={() => handleOAuthSignIn("google")}
              disabled={!!isOAuthLoading || isLoading}
            >
              {isOAuthLoading === "google" ? (
                "Redirecting..." // Add a spinner icon later if desired
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
