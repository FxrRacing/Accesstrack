'use client'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {  Software, SoftwareHistory, UserProfiles } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {GradientAvatar} from "@/components/gradient-avatar"
import { Clock, } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

export type HistoryWithUser = SoftwareHistory & { updatedBy: UserProfiles, software: Software }
type props = {
    history: HistoryWithUser[]
}

const formatCurrency = (value: string | null) => {
  if (!value) return '0.00'
  const num = parseFloat(value)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export default function HistorySheet({history}: props) {
    const formatRelativeTime = (date: Date) => {
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
        return `${Math.floor(diffInSeconds / 86400)} days ago`
      }

    const formatValue = (field: string, value: string | null) => {
      if (field === 'amount' || field === 'pricePerUser') {
        return formatCurrency(value)
      }
      return value
    }
      
    return <div>
        <Sheet>
  <SheetTrigger asChild><Button className="bg-black text-white hover:bg-black/90 rounded-full px-6"> <Clock className="mr-2 h-4 w-4" /> View History</Button></SheetTrigger>
  <SheetContent className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle>History</SheetTitle>
      <SheetDescription>
        View the history of changes to this account.
      </SheetDescription>
      {/* <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="mt-4">Filter <Filter className="ml-2 h-4 w-4" /></Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2 space-y-2">
              <div className="flex items-center gap-2">
              <Checkbox id="name" />
              <Label htmlFor="name">Name</Label>
              </div>
              <div className="flex items-center gap-2">
              <Checkbox id="email" />
              <Label htmlFor="email">Email</Label>
              </div>
              <div className="flex items-center gap-2">
              <Checkbox id="location" />
              <Label htmlFor="location">Location</Label>
              </div>
              <div className="flex items-center gap-2">
              <Checkbox id="type" />
              <Label htmlFor="type">Type</Label>
              </div>

              
               <Separator className="my-2" />
               <div className="flex items-center gap-2">
              <Checkbox id="today" />
              <Label htmlFor="today">Today</Label>
              </div>
              <div className="flex items-center gap-2">
              <Checkbox id="yesterday" />
              <Label htmlFor="yesterday">Yesterday</Label>
              </div>
              
              <div className="flex items-center gap-2">
              <Checkbox id="this-week" />
              <Label htmlFor="this-week">This Week</Label>
              </div>
              <div className="flex items-center gap-2">
              <Checkbox id="this-month" />
              <Label htmlFor="this-month">This Month</Label>
              </div>
            
            </div>
          </PopoverContent>
        </Popover>
      </div> */}
    </SheetHeader>
   <ScrollArea className="h-[calc(100vh-8rem)]">
   <div className="flex flex-col gap-2">
        {history.map((history) => (
            <>
            <div key={history.id} className="space-y-4 p-4">
                <div className="flex gap-4 px-6 py-2 space-y-4">
                  <GradientAvatar seed={history.updatedById} size={40} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">@{history.updatedBy.fullName?.replace(" ", "")}</span>
                        <span className="text-muted-foreground ml-2">{formatRelativeTime(history.updatedOn)}</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium">{history.action}</span>
                        {history.field && (
                          <span className="text-muted-foreground"> • Field: {history.field}</span>
                        )}
                      </p>

                      {history.oldValue && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">From:</span> {formatValue(history.field, history.oldValue)}
                        </p>
                      )}

                      {history.newValue && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">To:</span> {formatValue(history.field, history.newValue)}
                        </p>
                      )}

<Link href={`/dashboard/users/${history.updatedById}`} className="text-xs text-muted-foreground mt-2" prefetch={true}>
                      <p className="text-xs text-muted-foreground mt-2">User ID: {history.updatedBy.fullName}</p>
                      </Link>
                    </div>
                  </div>
                </div>
                <Separator />
              </div>
            
            
            </>
        ))}
    </div>
   </ScrollArea>
  </SheetContent>
</Sheet>

        
    </div>
}