import { CommandMenu } from "@/components/command-menu"
import { ModeSwitcher } from "@/components/mode-switcher"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear bg-background rounded-t-xl">
      <div className="flex items-center gap-2 px-2 md:px-4 flex-1 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 hidden md:flex" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 hidden md:flex"
          />
        </div>
        <div className="w-full flex-1 md:w-auto md:flex-none">
          <CommandMenu />
        </div>
        <nav className="flex items-center gap-0.5">
          <ModeSwitcher />
        </nav>
      </div>
    </header>
  )
}
