"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DumbbellIcon, HeartIcon, ChartArea, UserIcon } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Workouts",
      href: "/workouts",
      icon: DumbbellIcon,
    },
    {
      title: "Favorites",
      href: "/favorites",
      icon: HeartIcon,
    },
    {
      title: "History",
      href: "/history",
      icon: ChartArea,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: UserIcon,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background md:hidden">
      <div className="grid grid-flow-col grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-2",
              "text-muted-foreground hover:text-foreground",
              pathname === item.href && "text-foreground"
            )}
          >
            <item.icon className="size-5" />
            <span className="text-xs">{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
