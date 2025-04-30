'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createInvite } from "./actions";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";

const initialState = {
    message: '',
  }
export default function Invite({authId}: {authId: string}) {
    const [error, formAction, pending] = useActionState(createInvite, initialState)
    return ( 
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/90">
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>   
              <DialogDescription>
                Enter the details of the new user. They will receive an email invitation.
              </DialogDescription>
            </DialogHeader>
            <form action={formAction}>
            <input type="text" name="createdById" value={authId} hidden readOnly />
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" name="name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" name="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  name="role"
                >
                  <option value="admin">Administrator</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                  <option value="accountant">Accountant</option>
                  <option value="sales">Sales</option>
                  <option value="marketing">Marketing</option>
                  <option value="support">Support</option>
                  <option value="hr">HR</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              {pending ? <Button  className="bg-black text-white hover:bg-black/90" disabled>
                Sending...
              </Button> : <Button type="submit" className="bg-black text-white hover:bg-black/90">
                Send Invitation
              </Button>
}
{error && <p>{error.message}</p>}
            </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>       
    )
}