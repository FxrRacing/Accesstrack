import { assignSoftware } from "@/actions/sharedAccount_actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
   
    DialogClose,
   
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SharedAccount, Software} from "@prisma/client";
import { User } from "@supabase/supabase-js";
import { Plus } from "lucide-react";




export default function AddSoftwareDialog({sharedAccount, availableSoftware, data}: {sharedAccount: SharedAccount, availableSoftware: Software[], data: {user: User}}) {
    return (
        <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> Assign Software</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Software</DialogTitle>
            <DialogDescription>
              Assign software to the shared account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
            <form action={assignSoftware} className="flex flex-col gap-4">
                    <input
                      type="text"
                      name="sharedAccountId"
                      readOnly
                      value={sharedAccount.id}
                      hidden
                    />
                    <Label>Software</Label>

                    <Select name="softwareId">
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select Software" />
                        </SelectTrigger>
                        <SelectContent>
                      {availableSoftware.map((software) => (
                        <SelectItem key={software.id} value={software.id} className="cursor-pointer">
                          {software.name}
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
                    <Label>Access Level</Label>
                    <Input
                      type="text"
                      name="accessLevel"
                      defaultValue="admin"
                    />
                    <Label>Role</Label>
                    <Input type="text" name="role" defaultValue="admin" />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Assign</Button>
                  </form>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}   