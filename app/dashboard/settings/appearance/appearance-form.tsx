"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"


// import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
// import { Info } from "lucide-react"
import { Button,  } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
//import { toast } from "sonner"
import { useTheme } from "next-themes"

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
  // font: z.enum(["inter", "manrope", "system"], {
  //   invalid_type_error: "Select a font",
  //   required_error: "Please select a font.",
  // }),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AppearanceFormValues> = {
  theme: "light",
}

export function AppearanceForm() {
  const { setTheme } = useTheme()
  const [showZincWarning, setShowZincWarning] = useState(false)
  const [pendingTheme, setPendingTheme] = useState<string | null>(null)
  
  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  function onSubmit(data: AppearanceFormValues) {
   
    
   
      setTheme(data.theme)
  
  }

  const handleConfirmZincTheme = () => {
    if (pendingTheme) {
      setTheme(pendingTheme)
      setShowZincWarning(false)
      setPendingTheme(null)
    }
  }

  const handleCancelZincTheme = () => {
    setShowZincWarning(false)
    setPendingTheme(null)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* <FormField
            control={form.control}
            name="font"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font</FormLabel>
                <div className="relative w-max">
                  <FormControl>
                    <select
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-[200px] appearance-none font-normal"
                      )}
                      {...field}
                    >
                      <option value="inter">Inter</option>
                      <option value="manrope">Manrope</option>
                      <option value="system">System</option>
                    </select>
                  </FormControl>
                  <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                </div>
                <FormDescription>
                  Set the font you want to use in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Theme</FormLabel>
                <FormDescription>
                  Select the theme for the dashboard.
                </FormDescription>
                <FormMessage />
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid max-w-md grid-cols-2 gap-8 pt-2"
                >
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                      <FormControl>
                        <RadioGroupItem value="light" className="sr-only" />
                      </FormControl>
                      <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                        <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                          <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal">
                        Light
                      </span>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                      <FormControl>
                        <RadioGroupItem value="dark" className="sr-only" />
                      </FormControl>
                      <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                        <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                          <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal">
                        Dark
                      </span>
                    </FormLabel>
                  </FormItem>
                  {/* @experimental */}
                 
                 
                  {/* <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                      <FormControl>
                        <RadioGroupItem value="zinc" className="sr-only" />
                      </FormControl>
                      <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                        <div className="space-y-2 rounded-sm bg-zinc-950 p-2">
                          <div className="space-y-2 rounded-md bg-zinc-800 p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-zinc-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-zinc-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-zinc-800 p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-zinc-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-zinc-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-zinc-800 p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-zinc-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-zinc-400" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal">
                        Zinc<TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-5 w-5 text-destructive" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-red-600">
                            <p>This is an experimental feature, to disable it select another theme and refresh</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      </span>
                    </FormLabel>
                  </FormItem> */}
                 
                </RadioGroup>
              </FormItem>
            )}
          />

          <Button type="submit">Update preferences</Button>
        </form>
      </Form>

      {/* Zinc Theme Warning Dialog */}
      <Dialog open={showZincWarning} onOpenChange={setShowZincWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Experimental Feature Warning</DialogTitle>
            <DialogDescription>
              The Zinc theme is an experimental feature. It may have visual inconsistencies or unexpected behaviors.
              <br /><br />
              <strong>To disable it later:</strong> Select another theme and refresh the page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelZincTheme}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmZincTheme}>
              Use Zinc Theme Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}