import { assignSoftware } from "@/actions/sharedAccount_actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
   
    
   
    DialogContent,
    DialogDescription,
   
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { SharedAccount, Software} from "@prisma/client";
import { User } from "@supabase/supabase-js";





export default function AddSharedAccountsDialog({software, availableSharedAccounts, data}: {software: Software, availableSharedAccounts: SharedAccount[], data: {user: User}}) {
    
    return (
    //     <Dialog>
    //     <DialogTrigger asChild>
    //       <Button  size="sm" className="h-8 px-2  hover:bg-slate-50">
    //         <Plus className="w-4 h-4 mr-2" /> Assign Shared Account
    //         {availableSharedAccounts.length > 0 ? <span className="text-xs text-gray-500">({availableSharedAccounts.length})</span> : null}
    //         </Button>

    //     </DialogTrigger>
    //     <DialogContent className="sm:max-w-md">
    //       <DialogHeader>
    //         <DialogTitle>Assign Shared Account</DialogTitle>
    //         <DialogDescription>
    //           Assign shared account to the software.
    //         </DialogDescription>
    //       </DialogHeader>
    //       <div className="flex items-center gap-2">
    //         <div className="grid flex-1 gap-2">
    //         <form action={assignSoftware} className="flex flex-col gap-4">
    //                 <input
    //                   type="text"
    //                   name="softwareId"
    //                   readOnly
    //                   value={software.id}
    //                   hidden
    //                 />
    //                 <Label>Shared Account</Label>

    //                 <Select name="sharedAccountId">
    //                     <SelectTrigger className="w-full cursor-pointer">
    //                         <SelectValue placeholder="Select Shared Account" />
    //                     </SelectTrigger>
    //                     <SelectContent>
    //                   {availableSharedAccounts.map((sharedAccount) => (
    //                     <SelectItem key={sharedAccount.id} value={sharedAccount.id} className="cursor-pointer">
    //                       {sharedAccount.name}
    //                     </SelectItem>
    //                   ))}
    //                   </SelectContent>
    //                 </Select>
    //                 <input
    //                   type="text"
    //                   name="grantedById"
    //                   readOnly
    //                   value={data.user.id}
    //                   hidden
    //                 />
    //                 <Label>Access Level</Label>
    //                 <Input
    //                   type="text"
    //                   name="accessLevel"
    //                   defaultValue="admin"
    //                 />
    //                 <Label>Role (optional description)</Label>
    //                 <Input type="text" name="role" defaultValue="admin" />
    //                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Assign</Button>
    //               </form>   
    //         </div>
    //       </div>
    //       <DialogFooter className="sm:justify-start">
    //         <DialogClose asChild>
    //           <Button type="button" variant="secondary">
    //             Close
    //           </Button>
    //         </DialogClose>
    //       </DialogFooter>
    //     </DialogContent>
    //   </Dialog>
    <Dialog>
  <DialogTrigger  className="h-8 px-2  hover:bg-slate-50 text-sm border border-gray-200 rounded-md" >
    
      Assign Shared Account
      
   
    </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>

    <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
            <form action={assignSoftware} className="flex flex-col gap-4">
                    <input
                      type="text"
                      name="softwareId"
                      readOnly
                      value={software.id}
                      hidden
                    />
                    <Label>Shared Account</Label>

                    <Select name="sharedAccountId">
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select Shared Account" />
                        </SelectTrigger>
                        <SelectContent>
                      {availableSharedAccounts.map((sharedAccount) => (
                        <SelectItem key={sharedAccount.id} value={sharedAccount.id} className="cursor-pointer">
                          {sharedAccount.name}
                        </SelectItem>
                      ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="text"
                      name="grantedById"
                      readOnly
                      value={data.user.id}
                      hidden
                    />
                    <Label>Access Level (admin, edit, view, revoke)</Label>
                    <Input
                      type="text"
                      name="accessLevel"
                      defaultValue="admin"
                    />
                    <Label>Role (optional description)</Label>
                    <Input type="text" name="role" defaultValue="admin" />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Assign</Button>
                  </form>   
            </div>
    </div>
  </DialogContent>
</Dialog>
    )
}   