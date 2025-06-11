'use client'

import { Button } from "@/components/ui/button"

import { UserMinus } from "lucide-react"
import { useActionState, useEffect} from "react"
import { removeOwner } from "../actions/owner"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Software } from "@prisma/client"

export default function RemoveOwner({software, authId}: {software: Software, authId: string}) {
    const initialState = { message: '', success: false }
    const [state, formAction, pending] = useActionState(removeOwner, initialState)
    useEffect(() => {
        if (state?.message) {
            if (state.success && !software.teamOwnerId ) {

                toast.success(state.message)
               
            } else {
                toast.error(state.message)
            }
        }
    }, [state,software])
    return (
        <AlertDialog >
  <AlertDialogTrigger asChild>
  <Button variant="ghost" className="justify-start text-sm text-destructive" >
          <UserMinus className="mr-2 h-4 w-4" />
          Remove IT Owner
        </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will remove the IT Owner from the software.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <form action={formAction}>
        <input type="hidden" name="softwareId" value={software.id} />
        <input type="hidden" name="authId" value={authId} />
        <AlertDialogAction type="submit" disabled={pending}>Remove Owner</AlertDialogAction>
      </form>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        
    )
}