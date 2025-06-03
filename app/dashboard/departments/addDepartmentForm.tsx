"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconCirclePlus } from "@tabler/icons-react";
import { createDepartment } from "./actions";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = { message: "" };
export default function AddDepartmentForm({ users }: { users: User[] }) {
  const [state, formAction, pending] = useActionState(
    createDepartment,
    initialState
  );
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className=" rounded-full hover:cursor-pointer">
            <IconCirclePlus className="h-4 w-4" />
            Create Department
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
          </DialogHeader>
          <DialogDescription>Create a new department</DialogDescription>
          <form action={formAction} className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input name="name" placeholder="Name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Input name="description" placeholder="Description" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="departmentHeadId">Department Head</Label>
              <Select name="departmentHeadId">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Department Head" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <p aria-live="polite">{state?.message}</p>
              <Button disabled={pending}>Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
