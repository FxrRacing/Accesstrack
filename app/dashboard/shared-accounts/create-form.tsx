'use client'
import { createSharedAccount } from "@/actions/sharedAccount_actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@supabase/supabase-js";
import { CirclePlus, Loader2 } from "lucide-react";
import { statusOptions } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

// const initialState = {message: '', errors: null, id: ''}
const initialState = {
  message: '',
  errors: {} as Record<string, string[]>
}

export default function CreateForm({user}: {user: User}) {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(createSharedAccount, initialState,)
    useEffect(() => {
        if (state.message === 'success' && state.id) {
            router.push(`/dashboard/shared-accounts/${state.id}`);
        }
    }, [state, router]);
    return (
        <Dialog>
        <DialogTrigger asChild>
          <Button className="rounded-full px-6">
            <CirclePlus className="mr-2 h-4 w-4" />
            Create Shared Account
          </Button>
        </DialogTrigger>
      
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Software</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Create a new software item
          </DialogDescription>
          <form action={formAction} className="flex flex-col gap-2 space-y-1">
            <Label>Name</Label>
                <Input type="text" name="name" placeholder="Name" />
                <Label>Email</Label>
                <Input type="text" name="email" placeholder="Email" />
                <Label>Location</Label>
                <Input type="text" name="location" placeholder="Location" />
                <Label>Type</Label>
                <Input type="text" name="type" placeholder="Type" />
                <Label>Status</Label>
                <Select name="status" defaultValue={statusOptions[0].value}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input type="text" name="updatedBy"  defaultValue={user.id} hidden />
                <Button type="submit" disabled={pending}>{pending ? <Loader2 className="animate-spin" /> : "Create Shared Account"}</Button>
                {state.message && <p className="text-red-500">{state.message}</p>}
               
            </form>

        </DialogContent>
      </Dialog>
    )
}