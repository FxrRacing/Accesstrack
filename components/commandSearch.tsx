'use client'
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";


import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"
    import { Input } from "@/components/ui/input"
import {  DialogTitle } from "@radix-ui/react-dialog"
import Link from "next/link"
import {  SearchIcon, UsersIcon,SettingsIcon,HelpCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
    import { Button } from "@/components/ui/button"
  
export default function CommandSearch() { 
    const [isCommandOpen, setIsCommandOpen] = useState(false)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setIsCommandOpen((open) => !open)
          }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
      }, [])
    
   const isMobile = useIsMobile()
    if (isMobile) return (
        <>
        <Drawer open={isCommandOpen} onOpenChange={setIsCommandOpen}>
      <DrawerTrigger asChild>
      <div className="relative ml-auto flex-1 md:grow-0 mr-3">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search or Ctrl+K"
              className="w-[150px] rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
             
            />

          </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>


        <Command>
           <VisuallyHidden.Root>
        <DialogTitle className="DialogTitle">Search/Command Box</DialogTitle>
        </VisuallyHidden.Root>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <UsersIcon className="mr-2 h-4 w-4" />
                <span>Search Users</span>
              </CommandItem>
              <CommandItem>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Change User Settings</span>
              </CommandItem>
              <CommandItem>
                <HelpCircleIcon className="mr-2 h-4 w-4" />
                <span>View Documentation</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <span>Change Theme</span>
                <CommandShortcut>⌘T</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Link href="/dashboard/settings">
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
                </Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

        </>
    )
    return(<>
     <div className="relative ml-auto flex-1 md:grow-0 mr-3">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="w-[150px] rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              onFocus={() => setIsCommandOpen(true)}
            />

          </div>
          <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen} >
        <Command className=" ">
           <VisuallyHidden.Root>
        <DialogTitle className="DialogTitle">Search/Command Box</DialogTitle>
        </VisuallyHidden.Root>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <UsersIcon className="mr-2 h-4 w-4" />
                <span>Search Users</span>
              </CommandItem>
              <CommandItem>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Change User Settings</span>
              </CommandItem>
              <CommandItem>
                <HelpCircleIcon className="mr-2 h-4 w-4" />
                <span>View Documentation</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <span>Change Theme</span>
                <CommandShortcut>⌘T</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Link href="/dashboard/settings">
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
                </Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    
    </>)
}