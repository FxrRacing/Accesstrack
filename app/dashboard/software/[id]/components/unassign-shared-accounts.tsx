'use client'
import { removeAssignedSoftware } from "@/actions/sharedAccount_actions";
import { Button } from "@/components/ui/button";
import { Loader2,  } from "lucide-react";

import { useActionState,  } from "react";
import { toast } from "sonner";

const initialState = {message: ''}

export default function UnassignSoftwareButton({id, sharedAccountId, authId, softwareId}: {id: string, sharedAccountId: string, authId: string, softwareId: string}) {
    const [state, formAction, pending] = useActionState(removeAssignedSoftware, initialState)
    
   
    return <form action={formAction} className="flex flex-col gap-4 w-24">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="sharedAccountId" value={sharedAccountId} />
        <input type="hidden" name="authId" value={authId} />
        <input type="hidden" name="softwareId" value={softwareId} />
        {state.message && toast.success(state.message)}

        <Button type="submit" disabled={pending} className=" hover:bg-red-600" 
        onClick={() => toast.success('Removing Software from Shared Account...')}>
            {pending ? <Loader2 className="animate-spin" /> : <></>} Unassign
        </Button>
    </form>
}