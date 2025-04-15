"use client"

import * as React from "react"
import { BicepsFlexed, ChartArea, Heart } from "lucide-react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { siteConfig } from "@/config/site"

const navItems = [
  {
    title: "Workouts",
    url: "/workouts",
    icon: BicepsFlexed,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: Heart,
  },
  {
    title: "History",
    url: "/history",
    icon: ChartArea,
    disabled: true,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  const data = {
    user: {
      name: "cstoeckl",
      email: "christopher@cstoeckl.de",
      avatar: "/avatars/cstoeckl.png",
    },
    navMain: navItems.map(item => ({
      ...item,
      isActive: pathname === item.url
    })),
  }

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              className="flex items-center gap-2 [&>span:last-child]:truncate"
            >
              <div className="flex aspect-square size-8 items-center justify-center">
                <Icons.logo className="size-6" />
              </div>
              <span className="font-semibold lg:inline-block">
                {siteConfig.name}
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
