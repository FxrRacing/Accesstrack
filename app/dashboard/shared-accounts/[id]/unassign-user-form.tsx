"use client"
import { unassignUserFromSharedAccount } from "@/actions/sharedAccount_actions";
import{ Button} from "@/components/ui/button";
import { User } from "@prisma/client";
import { useActionState } from "react";


export function UnassignButton({user, sharedAccountId, authId}: {user: User, sharedAccountId: string, authId: string}) {
    //<Button onClick={()=>unassignUserFromSharedAccount( id, sharedAccountId,authId)}>{pending ? 'Unassigning...' : 'Unassign'}</Button>
    const initialState = {
        message: ''
    }
   
    const [error, formAction, pending] = useActionState(unassignUserFromSharedAccount, initialState)
    return(
        <form action={formAction}>
            <input type="text" name="id" value={user.id} hidden readOnly />
            <input type="text" name="name" value={user.name} hidden readOnly />
            <input type="text" name="sharedAccountId" value={sharedAccountId} hidden readOnly />
            <input type="text" name="authId" value={authId} hidden readOnly />
            <Button type="submit">{pending ? 'Unassigning...' : 'Unassign'}</Button>
            {error && <p>{error.message}</p>}
        </form>
    )
    
    
}