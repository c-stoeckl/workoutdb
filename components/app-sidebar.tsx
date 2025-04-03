"use client"

import * as React from "react"
import { BicepsFlexed, ChartArea, Heart } from "lucide-react"

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

const data = {
  user: {
    name: "cstoeckl",
    email: "christopher@cstoeckl.de",
    avatar: "/avatars/cstoeckl.jpg",
  },
  navMain: [
    {
      title: "Workouts",
      url: "/workouts",
      icon: BicepsFlexed,
      isActive: true,
    },
    {
      title: "Favorites",
      url: "/favorites",
      icon: Heart,
      isActive: false,
    },
    {
      title: "History",
      url: "/history",
      icon: ChartArea,
      isActive: false,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
