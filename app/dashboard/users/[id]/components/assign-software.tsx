
import {assignSoftware} from "@/actions/user_actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Software } from "@prisma/client";
    export default async function AssignSoftware({id, authId, availableSoftware}: {id: string, authId: string, availableSoftware: Software[]}) {
   
    return (
        <>

        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 text-sm font-medium hover-lift micro-bounce">
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Software
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Software</DialogTitle>
                    <DialogDescription>
                    Assign software to the user.
                </DialogDescription>
                </DialogHeader>
                <form action={assignSoftware} className='flex flex-col gap-4'>
            <select name="softwareId">
                {availableSoftware.map((software) => (
                    <option key={software.id} value={software.id}>{software.name}</option>
                ))}
            </select>
            <input type="text" name="grantedById"  defaultValue={authId} hidden />
            {/* <select name="grantedById" className='flex flex-col gap-4'>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select> */}
            
            <input type="text" name="accessLevel" placeholder="Access Level*" />
            <input type="text" name="role" placeholder="Role*" />
            <input type="text" name="userId" defaultValue={id} hidden />
            <button type="submit">Assign Software +</button>
        </form>
                
            </DialogContent>
        </Dialog>
       
        
        </>
    )
}