'use client'


import {  addUserToSharedAccount } from "@/actions/sharedAccount_actions"
import { User } from "@prisma/client"
import { useActionState, useCallback, useState } from "react"
import { AddUsersDialog, } from "./add-users-dialog"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"


const initialState = {
    message: '',
  }
export default function AddUserForm({id, availableUsers, authId}: {id: string, availableUsers: User[], authId: string}) {
    const [error, formAction, pending] = useActionState(addUserToSharedAccount, initialState)
    const [loading, setLoading] = useState(false)
  

    const handleSuccess = useCallback(() => {
        setLoading(false)
        toast.success("Users added successfully")
    }, [])
    
    return <div>
       <AddUsersDialog
            users={availableUsers}
            sharedAccountId={id}
            authId={authId}
            isLoading={loading}
            onSuccess={handleSuccess}
            triggerButton={
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Users
              </Button>
            }
          />
        

{/*if local dev show this form*/}
{process.env.NODE_ENV === 'development' && (
        <form action={formAction}>
            <input type="text" name="sharedAccountId" value={id} hidden readOnly />
            <input type="text" name="authId" value={authId} hidden readOnly />
            <select name="userId">
                {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            <button type="submit">{pending ? 'Adding...' : 'Add'}</button>
            {error && <p>{error.message}</p>}
        </form>
    )}
    </div>
}
