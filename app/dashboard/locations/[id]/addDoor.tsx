'use client'


import { DOOR_STATUS_OPTIONS, DOOR_TYPE_OPTIONS } from "@/utils/constants"
import { createDoor } from "../actions"
import { useActionState } from "react"
import { Department } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const initialState = {message: '', errors: null}

export default function AddDoor({locationId, departments}: {locationId: string, departments: Department[]}) {
    const [state, formAction, isPending] = useActionState(createDoor, initialState)
    return (
        <form action={formAction} className="flex flex-col gap-2 w-1/2">
            <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name:</Label>
                <Input type="text" id="name" name="name" />
                <input type="hidden" name="locationId" value={locationId} readOnly />
                <Label htmlFor="floor">Floor:</Label>
                <Input type="text" name="floor" />
                <Label htmlFor="type">Type:</Label>
                <Select name="type">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {DOOR_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Label htmlFor="status">Status:</Label>
                <Select name="status">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {DOOR_STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Label htmlFor="accessLevel">Primary Access Level:</Label>
                <Select name="accessLevel">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Access Level" />
                    </SelectTrigger>
                    <SelectContent>
                        {departments.map((department) => (
                            <SelectItem key={department.name} value={department.name}>{department.name}</SelectItem>
                        ))}
                        <SelectItem value="all-staff">All Staff</SelectItem>
                    </SelectContent>


                </Select>
                <Button type="submit" disabled={isPending}>Add Door</Button>
               
                {state.message && <p>{state.message}</p>}
            </div>
            
        </form>
    )
}
// floor: formData.get('floor'),
//         type: formData.get('type'),
//         locationId: formData.get('locationId'),

