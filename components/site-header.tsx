import Link from "next/link"

import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { CommandMenu } from "@/components/command-menu"
import { siteConfig } from "@/config/site"
import { ModeSwitcher } from "@/components/mode-switcher"

export function SiteHeader() {
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center">
          <MainNav />
          <MobileNav />
          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <CommandMenu />
            </div>
            <nav className="flex items-center gap-0.5">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 px-0"
              >
                <Link
                  href={siteConfig.links.x}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sr-only">X</span>
                </Link>
              </Button>
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
