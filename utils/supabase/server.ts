import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type SupabaseCookie = { name: string; value: string };
type SupabaseSetCookie = { name: string; value: string; options?: any };

/**
 * Creates a Supabase server client with Next.js 15 async cookies API.
 * Ensures type safety and compatibility with SSR and Supabase SSR helpers.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll(): SupabaseCookie[] {
          return cookieStore.getAll().map(({ name, value }) => ({
            name,
            value,
          }));
        },
        setAll(cookiesToSet: SupabaseSetCookie[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              // .set() is available in server actions, route handlers, middleware
              // In SSR, this is a no-op if not mutable
              cookieStore.set(name, value, options);
            } catch {
              // Ignore errors in SSR context
            }
          });
        },
      },
    },
  );
}
