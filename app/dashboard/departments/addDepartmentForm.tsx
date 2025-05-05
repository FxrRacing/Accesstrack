'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IconCirclePlus } from "@tabler/icons-react";
import { createDepartment } from "./actions";
import { useActionState } from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {message: ''}
export default function AddDepartmentForm() {
    const [state, formAction, pending] = useActionState(createDepartment, initialState)
    return (
        <>
        <Dialog>
            <DialogTrigger>
                <Button className=" rounded-full">
                    <IconCirclePlus className="h-4 w-4" />
                    Create Department
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Department</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Create a new department
                </DialogDescription>
                <form action={formAction} className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input name="name" placeholder="Name" />
                       
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input name="description" placeholder="Description" />
                    </div>
                    <p aria-live="polite">{state?.message}</p>
                <DialogFooter>
                    <Button disabled={pending}>Create</Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        </>
    )}