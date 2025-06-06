'use client'

import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { deleteSharedAccount } from "./actions";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const initialState = {message: ''}



export default function DeleteButton({id}: {id: string}) {
    const [state, formAction, pending] = useActionState(deleteSharedAccount, initialState)
    useEffect(() => {
        if (state.message === 'Deleted') {
            console.log('redirecting')
            redirect('/dashboard/shared-accounts')
        }
    }, [state])
    return<>
    <form action={formAction}>
        <input type="hidden" name="id" value={id} />
    <Button type="submit" disabled={pending} onClick={() => toast.success('Deleting Shared Account...')}>{pending ? <Loader2 className="animate-spin" /> : <Trash2 className="w-4 h-4" />}</Button>
    </form>
    {state.message && toast.error(state.message)}
    </>
    
}