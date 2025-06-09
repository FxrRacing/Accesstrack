"use client"

import * as React from "react"
import { ChevronDownIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
//import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface YearCalendarProps {
  name: string
  defaultValue?: Date
  onChange?: (date: Date | undefined) => void
}

export function YearCalendar({ name, defaultValue, onChange }: YearCalendarProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(defaultValue)

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDate(undefined)
    onChange?.(undefined)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* <Label htmlFor="date" className="px-1">
        Purchase Date
      </Label> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal group relative"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <div className="flex items-center gap-2">
              {date && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  onClick={clearDate}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              onChange?.(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
      <input 
        type="hidden" 
        name={name} 
        value={date ? date.toISOString() : "null"} 
      />
    </div>
  )
}
