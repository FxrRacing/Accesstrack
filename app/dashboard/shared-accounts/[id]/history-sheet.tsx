'use client'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SharedAccount, SharedAccountHistory, UserProfiles } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {GradientAvatar} from "./gradient-avatar"
import { Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
export type HistoryWithUser = SharedAccountHistory & { updatedBy: UserProfiles, sharedAccount: SharedAccount }
type props = {
    history: HistoryWithUser[]
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
    
    return <div>
        <Sheet>
  <SheetTrigger asChild><Button className="bg-black text-white hover:bg-black/90 rounded-full px-6"> <Clock className="mr-2 h-4 w-4" /> View History</Button></SheetTrigger>
  <SheetContent className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle>History</SheetTitle>
      <SheetDescription>
        View the history of changes to this account.
      </SheetDescription>
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
                        <span className="font-medium">@{history.updatedBy.email?.replace(" ", "")}</span>
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
                          <span className="font-medium">From:</span> {history.oldValue}
                        </p>
                      )}

                      {history.newValue && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">To:</span> {history.newValue}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mt-2">Account ID: {history.sharedAccountId}</p>
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