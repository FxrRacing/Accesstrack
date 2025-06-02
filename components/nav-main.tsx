"use client"


import { usePathname } from "next/navigation"


import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import QuickAddTabs from "./quick-add-tabs"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ElementType
  }[]
}) {
  const pathname = usePathname()
  // Split the pathname into segments and get the second segment (index 1)
  const pathSegments = pathname.split('/').filter(Boolean)
  const activeSegment = pathSegments[1] // This will be "users" in "/dashboard/users/some-id"
  
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <QuickAddTabs /> 
            {/* <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
             
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton> */}
            
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            // Extract the last segment from the item URL to compare with active segment
            const itemSegments = item.url.split('/').filter(Boolean)
            const itemLastSegment = itemSegments[itemSegments.length - 1]
            
            const isActive = activeSegment === itemLastSegment
            
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} prefetch={true}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    className={isActive ? "bg-primary/10 text-primary font-semibold border border-primary/10" : ""}
                  >
                    {item.icon && <item.icon className={isActive ? "font-bold" : ""} />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
