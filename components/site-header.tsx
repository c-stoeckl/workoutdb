"use client"

import { CommandMenu } from "@/components/command-menu"
import { ModeSwitcher } from "@/components/mode-switcher"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

export function SiteHeader() {
  const pathname = usePathname()

  const routeName = useMemo(() => {
    const path = pathname?.split("/")[1] || ""
    return path.charAt(0).toUpperCase() + path.slice(1) || "Dashboard"
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear bg-background rounded-t-xl">
      <div className="flex items-center gap-4 px-4 flex-1 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 hidden md:flex" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 hidden md:flex"
          />
          <h1 className="text-base font-medium">{routeName}</h1>
        </div>
        <div className="flex-1 w-auto md:flex-none">
          <CommandMenu />
        </div>
        <nav className="flex items-center gap-0.5">
          <ModeSwitcher />
        </nav>
      </div>
    </header>
  )
}
