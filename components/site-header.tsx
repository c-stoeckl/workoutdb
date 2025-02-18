import Link from "next/link"

import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { CommandMenu } from "@/components/command-menu"
import { siteConfig } from "@/config/site"
import { ModeSwitcher } from "@/components/mode-switcher"
import { Icons } from "@/components/icons"

export function SiteHeader() {
  return (
    <header className="flex fixed w-full h-14 z-40 items-center px-4 py-3 text-foreground border-b border-border/40 bg-background">
      <div className="flex items-center flex-1 justify-between">
        <div>
          <MainNav />
          <MobileNav />
        </div>
        <div className="w-full flex-1 md:w-auto md:flex-none">
          <CommandMenu />
        </div>
        <nav className="flex items-center gap-0.5">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 px-0">
            <Link href={siteConfig.links.x} target="_blank" rel="noreferrer">
              <Icons.x className="h-4 w-4" />
              <span className="sr-only">X</span>
            </Link>
          </Button>
          <ModeSwitcher />
        </nav>
      </div>
    </header>
  )
}
