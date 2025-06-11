'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { editDepartment } from "./actions"
import { Department } from "@prisma/client"
import { useState } from "react"

export default function EditDepartment({ department,}: { department: Department}) {
    const [name, setName] = useState(department.name || "");
    const [description, setDescription] = useState(department.description || "");
    const [departmentHeadId, setDepartmentHeadId] = useState(department.departmentHeadId || "");

    async function handleSubmit(formData: FormData) {
        await editDepartment({
            id: department.id,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            departmentHeadId: formData.get("departmentHeadId") as string,
            
        });
    }

    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Department</DialogTitle>
                    <DialogDescription>
                        Edit the department details here.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 mt-4">
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Department Name"
                    />
                    <Label htmlFor="description">Department Description</Label>
                    <Input
                        id="description"
                        name="description"
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Department Description"
                    />
                    <Label htmlFor="departmentHeadId">Department Head ID</Label>
                    <Input
                        id="departmentHeadId"
                        name="departmentHeadId"
                        type="text"
                        value={departmentHeadId}
                        onChange={e => setDepartmentHeadId(e.target.value)}
                        placeholder="Department Head ID"
                    />
                    <Button type="submit">Save Changes</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}