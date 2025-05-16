// "use client"

// import type React from "react"

// import { useEffect, useRef, useState } from "react"
// import { eachMonthOfInterval, eachYearOfInterval, endOfYear, format, isAfter, isBefore, startOfYear } from "date-fns"
// import { ChevronDownIcon } from "lucide-react"
// import type { CaptionProps, DayPickerProps } from "react-day-picker"

// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/cal"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"

// export default function DateTimePicker({ onSelect }: { onSelect?: (date: Date) => void }) {
//   const today = new Date()
//   const [month, setMonth] = useState(today)
//   const [date, setDate] = useState<Date | undefined>(today)
//   const [isYearView, setIsYearView] = useState(false)
//   const startDate = new Date(1980, 6)
//   const endDate = new Date(2030, 6)

//   const [hour, setHour] = useState<string>("08")
//   const [minute, setMinute] = useState<string>("00")
//   const [period, setPeriod] = useState<string>("AM")
  
//   // Use a ref to track if we've already notified about this specific timestamp
//   const lastNotifiedValue = useRef<string>("");
  
//   // Only notify parent when user has made a selection and values have changed
//   useEffect(() => {
//     if (date && onSelect) {
//       // Create a new date with the selected time
//       const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
//       const hours = parseInt(hour) + (period === "PM" && parseInt(hour) !== 12 ? 12 : 0);
//       selectedDate.setHours(hours === 12 && period === "AM" ? 0 : hours);
//       selectedDate.setMinutes(parseInt(minute));
//       selectedDate.setSeconds(0);
      
//       // Create a unique string representing this timestamp to compare
//       const valueString = selectedDate.toISOString();
      
//       // Only notify if the value has actually changed
//       if (lastNotifiedValue.current !== valueString) {
//         lastNotifiedValue.current = valueString;
//         onSelect(selectedDate);
//       }
//     }
//   }, [date, hour, minute, period, onSelect]);

//   const years = eachYearOfInterval({
//     start: startOfYear(startDate),
//     end: endOfYear(endDate),
//   })

//   return (
//     <div className="flex flex-col gap-4 p-3">
//       <Calendar
//         mode="single"
//         selected={date}
//         onSelect={setDate}
//         month={month}
//         onMonthChange={setMonth}
//         defaultMonth={new Date()}
//         startMonth={startDate}
//         endMonth={endDate}
//         className="overflow-hidden rounded-md border p-2 w-full"
//         classNames={{
//           month_caption: "ms-2.5 me-20 justify-start",
//           nav: "justify-end",
//         }}
//         components={{
//           CaptionLabel: (props: CaptionProps) => (
//             <CaptionLabel isYearView={isYearView} setIsYearView={setIsYearView} {...props} />
//           ),
//             MonthGrid: (props: DayPickerProps) => {
//             return (
//               <MonthGrid
//                 className={props.className}
//                 isYearView={isYearView}
//                 setIsYearView={setIsYearView}
//                 startDate={startDate}
//                 endDate={endDate}
//                 years={years}
//                 currentYear={month.getFullYear()}
//                 currentMonth={month.getMonth()}
//                 onMonthSelect={(selectedMonth: Date) => {
//                   setMonth(selectedMonth)
//                   setIsYearView(false)
//                 }}
//               >
//                 {props.children}
//               </MonthGrid>
//             )
//           },
//         }}
//       />
//         {date && (
//         <div className="mt-4 space-y-4">
//           <div className="text-sm font-medium">Selected: {format(date, "PPP")}</div>
//           <div className="grid grid-cols-3 gap-2">
//             <div className="space-y-2">
//               <Label htmlFor="hour">Hour</Label>
//               <Select value={hour} onValueChange={setHour}>
//                 <SelectTrigger id="hour">
//                   <SelectValue placeholder="Hour" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i).toString().padStart(2, "0")).map((hour) => (
//                     <SelectItem key={hour} value={hour}>
//                       {hour}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="minute">Minute</Label>
//               <Select value={minute} onValueChange={setMinute}>
//                 <SelectTrigger id="minute">
//                   <SelectValue placeholder="Minute" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((minute) => (
//                     <SelectItem key={minute} value={minute}>
//                       {minute}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="period">Period</Label>
//               <Select value={period} onValueChange={setPeriod}>
//                 <SelectTrigger id="period">
//                   <SelectValue placeholder="AM/PM" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="AM">AM</SelectItem>
//                   <SelectItem value="PM">PM</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="text-sm font-medium">
//             Selected Date and Time: {format(date, "PPP")} at {hour}:{minute} {period}
//           </div>
//         </div>
//       )}
    
      
//     </div>
//   )
// }

// function MonthGrid({
//   className,
//   children,
//   isYearView,
//   startDate,
//   endDate,
//   years,
//   currentYear,
//   currentMonth,
//   onMonthSelect,
// }: {
//   className?: string
//   children: React.ReactNode
//   isYearView: boolean
//   setIsYearView: React.Dispatch<React.SetStateAction<boolean>>
//   startDate: Date
//   endDate: Date
//   years: Date[]
//   currentYear: number
//   currentMonth: number
//   onMonthSelect: (date: Date) => void
// }) {
//   const currentYearRef = useRef<HTMLDivElement>(null)
//   const currentMonthButtonRef = useRef<HTMLButtonElement>(null)
//   const scrollAreaRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (isYearView && currentYearRef.current && scrollAreaRef.current) {
//       const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement
//       if (viewport) {
//         const yearTop = currentYearRef.current.offsetTop
//         viewport.scrollTop = yearTop
//       }
//       setTimeout(() => {
//         currentMonthButtonRef.current?.focus()
//       }, 100)
//     }
//   }, [isYearView])

//   return (
//     <div className="relative">
//       <table className={className}>{children}</table>
//       {isYearView && (
//         <div className="bg-background absolute inset-0 z-20 -mx-2 -mb-2">
//           <ScrollArea ref={scrollAreaRef} className="h-full">
//             {years.map((year) => {
//               const months = eachMonthOfInterval({
//                 start: startOfYear(year),
//                 end: endOfYear(year),
//               })
//               const isCurrentYear = year.getFullYear() === currentYear

//               return (
//                 <div key={year.getFullYear()} ref={isCurrentYear ? currentYearRef : undefined}>
//                   <CollapsibleYear title={year.getFullYear().toString()} open={isCurrentYear}>
//                     <div className="grid grid-cols-3 gap-2">
//                       {months.map((month) => {
//                         const isDisabled = isBefore(month, startDate) || isAfter(month, endDate)
//                         const isCurrentMonth = month.getMonth() === currentMonth && year.getFullYear() === currentYear

//                         return (
//                           <Button
//                             key={month.getTime()}
//                             ref={isCurrentMonth ? currentMonthButtonRef : undefined}
//                             variant={isCurrentMonth ? "default" : "outline"}
//                             size="sm"
//                             className="h-7"
//                             disabled={isDisabled}
//                             onClick={() => onMonthSelect(month)}
//                           >
//                             {format(month, "MMM")}
//                           </Button>
//                         )
//                       })}
//                     </div>
//                   </CollapsibleYear>
//                 </div>
//               )
//             })}
//           </ScrollArea>
//         </div>
//       )}
//     </div>
//   )
// }

// function CaptionLabel({
//   children,
//   isYearView,
//   setIsYearView,
// }: {
//   isYearView: boolean
//   setIsYearView: React.Dispatch<React.SetStateAction<boolean>>
// } & React.HTMLAttributes<HTMLSpanElement>) {
//   return (
//     <Button
//       className="data-[state=open]:text-muted-foreground/80 -ms-2 flex items-center gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
//       variant="ghost"
//       size="sm"
//       onClick={() => setIsYearView((prev) => !prev)}
//       data-state={isYearView ? "open" : "closed"}
//     >
//       {children}
//       <ChevronDownIcon
//         size={16}
//         className="text-muted-foreground/80 shrink-0 transition-transform duration-200"
//         aria-hidden="true"
//       />
//     </Button>
//   )
// }

// function CollapsibleYear({
//   title,
//   children,
//   open,
// }: {
//   title: string
//   children: React.ReactNode
//   open?: boolean
// }) {
//   return (
//     <Collapsible className="border-t px-2 py-1.5" defaultOpen={open}>
//       <CollapsibleTrigger asChild>
//         <Button
//           className="flex w-full justify-start gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
//           variant="ghost"
//           size="sm"
//         >
//           <ChevronDownIcon
//             size={16}
//             className="text-muted-foreground/80 shrink-0 transition-transform duration-200"
//             aria-hidden="true"
//           />
//           {title}
//         </Button>
//       </CollapsibleTrigger>
//       <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden px-3 py-1 text-sm transition-all">
//         {children}
//       </CollapsibleContent>
//     </Collapsible>
//   )
// }
