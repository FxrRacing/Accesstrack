"use client"

import { useState, useActionState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Shield, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { banUserAction} from "../actions"


export const banDurations = [
  { value: "1h", label: "1 Hour" },
  { value: "6h", label: "6 Hours" },
  { value: "24h", label: "24 Hours" },
  { value: "3d", label: "3 Days" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "permanent", label: "Permanent" },
]

const initialState = {
  success: false,
  error: "",
  message: "",
}


export default function BanAccessDialog({user_id}: {user_id: string}) {
  const [open, setOpen] = useState(false)
 
  const [banDuration, setBanDuration] = useState("")
  const [reason, setReason] = useState("")

  const [state, formAction, isPending] = useActionState(banUserAction, initialState)

  
  const isFormValid = user_id && banDuration

  // Reset form and close dialog on success
  if (state?.success && open) {
    setTimeout(() => {
      
      setBanDuration("")
      setReason("")
      setOpen(false)
    }, 2000)
  }

  return (
  
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className=" p-2 h-12 w-12 rounded-full  items-center justify-center gap-2">
          
            <Shield className="h-4 w-4" />
            <span className="text-sm text-center mt-2 ">Ban Access</span>
        
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Ban User
            </DialogTitle>
            <DialogDescription>Temporarily or permanently restrict a user&apos;s access to the platform.</DialogDescription>
          </DialogHeader>

          <form action={formAction} className="space-y-4 py-4">
            <input type="hidden" name="userId" value={user_id} />
            <input type="hidden" name="duration" value={banDuration} />
            <input type="hidden" name="reason" value={reason} />
            <input type="hidden" name="user_id" value={user_id} />
           

            <div className="space-y-2">
              <Label htmlFor="duration-select">Ban Duration</Label>
              <Select value={banDuration} onValueChange={setBanDuration} disabled={isPending}>
                <SelectTrigger id="duration-select">
                  <SelectValue placeholder="Select ban duration" />
                </SelectTrigger>
                <SelectContent>
                  {banDurations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Ban (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this user is being banned..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[80px]"
                disabled={isPending}
              />
            </div>

            {user_id && banDuration && !state && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>The Selected User</strong> will be banned for{" "}
                  <strong>{banDurations.find((d) => d.value === banDuration)?.label.toLowerCase()}</strong>
                  {banDuration === "permanent" ? "." : " and will not be able to access the platform during this time."}
                </AlertDescription>
              </Alert>
            )}

            {state?.error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{state.error}</AlertDescription>
              </Alert>
            )}

            {state?.success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{state.message}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={!isFormValid || isPending}>
                {isPending ? "Banning..." : "Ban User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  
  )
}
