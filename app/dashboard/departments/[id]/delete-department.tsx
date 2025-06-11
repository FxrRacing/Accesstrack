'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteDepartment } from "./actions";


export default function DeleteDepartment({ departmentId }: { departmentId: string }) {
    const deleteDepartmentWithId = deleteDepartment.bind(null, departmentId)
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete Department</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Department</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this department?
                    </DialogDescription>
                    <DialogFooter>
                        <form action={deleteDepartmentWithId}>
                        <Button variant="destructive">Delete</Button>
                        </form>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}