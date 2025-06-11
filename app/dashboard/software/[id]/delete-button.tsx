import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteSoftware } from "../actions";

export default function DeleteButton({ softwareId }: { softwareId: string }) {
    const deleteSoftwareWithId = deleteSoftware.bind(null, softwareId)
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="mx-2  h-8 px-2 hover:bg-slate-50 w-20">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Software</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this software?
                        Note: all users and software must be removed before it can be deleted .
                    </DialogDescription>
                    <DialogFooter>
                        <form action={deleteSoftwareWithId}>
                            <Button variant="destructive">Delete</Button>
                        </form>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>   
    )
}   