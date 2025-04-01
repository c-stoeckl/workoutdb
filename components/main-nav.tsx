"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-3 lg:mr-6">
        <Icons.logo className="size-6" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
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
