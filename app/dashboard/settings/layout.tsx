import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./components/sidebar-nav"
//create permissions
import {  Toaster } from "sonner"



  export const metadata: Metadata = {
    title: "Access Track - Settings",
    description: "Access Track is a user management system for FXR Factory Racing.",
  }

const sidebarNavItems = [
  // {
  //   title: "Account",
  //   href: "/dashboard/settings/account",
  // },
  //   {title: "Invite Users", 
  //       href: "/dashboard/settings"
  //   },
 
  
  {
    title: "Appearance",
    href: "/dashboard/settings/appearance",
  },
  // {
  //   title: "Notifications",
  //   href: "/settings/notifications",
  // },
  // {
  //   title: "Display",
  //   href: "/settings/display",
  // },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
     
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
          <Toaster />
        </div>
      </div>
     
    </>
    
  )
}