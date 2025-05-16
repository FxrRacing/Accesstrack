'use client'

import * as React from "react"
import {
  
  IconBuildings,
  IconCamera,
  
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  //IconFileWord,
 
  IconHelp,
  IconInnerShadowTop,
  IconKey,
  IconListDetails,
  //IconReport,
  IconSearch,
  IconSettings,
  IconTournament,
  IconUsers,
  IconBuildingCommunity,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { User } from "@supabase/supabase-js"
interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: "inset" | "sidebar" | "floating";
  user: User;
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Shared Accounts",
      url: "/dashboard/shared-accounts",
      icon: IconUsers,
    },
    {
      title: "Software",
      url: "/dashboard/software",
      icon: IconListDetails,
    },
    {
      title: "Keys & Codes",
      url: "/dashboard/keys&codes",
      icon: IconKey,
    },
    {
      title: "Departments",
      url: "/dashboard/departments",
      icon: IconBuildingCommunity,
    },
    {
      title: "Locations",
      url: "/dashboard/locations",
      icon: IconBuildings,
    },


    
    {
      title: "Org Chart",
      url: "/dashboard/org-chart",
      icon: IconTournament,
    },
    
    {
      title: "Team",
      url: "/dashboard/staff",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "mailto:itrequests@fxrracing.com?subject=Access%20Track%20Help%20Request&body=Hello,%0A%0A%20I%20need%20help%20with%20Access%20Track.%20I%20am%20trying%20to...",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Sharepoint",
      url: "https://fxrracing.sharepoint.com/",
      icon: IconDatabase,
    },
    // {
    //   name: "Reports",
    //   url: "#",
    //   icon: IconReport,
    // },
    // {
    //   name: "Word Assistant",
    //   url: "#",
    //   icon: IconFileWord,
    // },
  ],
}

export function AppSidebar({ variant, user, ...props }: AppSidebarProps) {
 
  
  return (
    <Sidebar collapsible="offcanvas" variant={variant} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Access Track</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
