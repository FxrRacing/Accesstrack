'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createInvite } from "./actions";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { ROLE_OPTIONS, TEAM_OPTIONS } from "@/utils/constants";

const initialState = {
    message: '',
  }
export default function Invite({authId}: {authId: string}) {
    const [error, formAction, pending] = useActionState(createInvite, initialState)
    return ( 
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/90 rounded-full px-6">
              <Plus className="mr-2 h-4 w-4" /> Invite User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite User</DialogTitle>   
              <DialogDescription>
                Enter the details of the new user. They will receive an email invitation that will allow them to sign up. They Can also sign up with their Microsoft account.
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
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="team">Team</Label>
                <select
                  id="team"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  name="team"
                >
                  {TEAM_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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