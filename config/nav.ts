import { NavItem } from "types/nav"

export interface NavConfig {
  mainNav: NavItem[]
}

export const navConfig: NavConfig = {
  mainNav: [
    {
      title: "Workouts",
      href: "/",
    },
  ],
}
