'use client'

import { createUser } from "@/actions/user_actions"
import { User } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

  



export default function CreateUserForm({users}: {users: User[]} ) {
  

  return(<>
  <Dialog>
  <DialogTrigger asChild>
    <Button>Create User</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create User</DialogTitle>
      <DialogDescription>
        Create a new user in the system.
      </DialogDescription>

    </DialogHeader>
    <form action={createUser} className='flex flex-col gap-4'>
                <Input type="text" name="name" placeholder="Name*" />
                <Input type="text" name="department" placeholder="Department*" />
                <Input type="text" name="jobTitle" placeholder="Job Title" />
                <Input type="text" name="email" placeholder="Email" />
                <Input type="text" name="location" placeholder="Location" />
                <label htmlFor="reportsTo">Reports To</label>
                <Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select manager" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="N/A">None</SelectItem>
    {users.map((user) => (
        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
    ))}
  </SelectContent>
</Select>


               
              
                
                <Button type="submit">Create User +</Button>
            </form>
  </DialogContent>
</Dialog>

    
            </>
  )
}