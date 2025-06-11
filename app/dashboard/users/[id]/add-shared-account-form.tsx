'use client'

import { SharedAccount } from "@prisma/client"
import { useActionState } from "react"
import { addUserToSharedAccount } from "@/actions/sharedAccount_actions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
export default function AddSharedAccountForm({id, availableSharedAccounts, authId}: {id: string, availableSharedAccounts: SharedAccount[], authId: string}) {
    const initialState = {
        message: '',
      }
    const [error, formAction, pending] = useActionState(addUserToSharedAccount, initialState)
    return <div>
       
       <Dialog>
  <DialogTrigger asChild>
    <Button>Add Shared Account</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Shared Account</DialogTitle>
      <DialogDescription>
        Add a shared account to the user.
      </DialogDescription>
    </DialogHeader>
    <form action={formAction}>
            <input type="text" name="userId"  readOnly value={id} hidden />
            <input type="text" name="authId" readOnly value={authId} hidden />
            <Select name="sharedAccountId" >
                <SelectTrigger className="w-full"> 
                    <SelectValue placeholder="Select a shared account" />
                </SelectTrigger>
                <SelectContent>
                    {availableSharedAccounts.map((sharedAccount) => (
                        <SelectItem key={sharedAccount.id} value={sharedAccount.id} className="cursor-pointer hover:bg-neutral-100">{sharedAccount.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button type="submit" className="w-full mt-4">{pending ? 'Adding...' : 'Add'}</Button>
            {error && <p>{error.message}</p>}
        </form>

  </DialogContent>
</Dialog>
        
    </div>
}