import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CommandMenu } from "@/components/command-menu"
import { siteConfig } from "@/config/site"
import { ModeSwitcher } from "@/components/mode-switcher"
import { Icons } from "@/components/icons"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear bg-background rounded-t-xl">
      <div className="flex items-center gap-2 px-4 flex-1 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          {/* <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          /> */}
        </div>
        {/* <div>
          <MainNav />
          <MobileNav />
        </div> */}
        <div className="w-full flex-1 md:w-auto md:flex-none">
          <CommandMenu />
        </div>
        <nav className="flex items-center gap-0.5">
          <Button asChild variant="ghost" size="icon" className="size-8 px-0">
            <Link href={siteConfig.links.x} target="_blank" rel="noreferrer">
              <Icons.x className="size-4" />
              <span className="sr-only">X</span>
            </Link>
          </Button>
          <ModeSwitcher />
        </nav>
      </div>
    </header>
  )
}
