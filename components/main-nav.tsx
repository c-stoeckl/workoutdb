"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/workouts"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/workouts" ? "text-foreground" : "text-foreground/80"
          )}
        >
          Workouts
        </Link>
      </nav>
    </div>
  )
}
