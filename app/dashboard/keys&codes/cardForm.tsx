'use client'

import { Input } from "@/components/ui/input"
import { createKeyCard } from "./actions"
import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Door, Location, User } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
const initialState = {
    message: '',
    errors: {} as Record<string, string[]>
  }
export default function CardForm({staff, locations}: {staff: User[], locations: Location[]}) {
    const [state, formAction, pending] = useActionState(createKeyCard, initialState)
    const [formData, setFormData] = useState({
        name: '',
        userId: '',
        type: '',
        
        description: '',
        locationId: '',
        doorId: ''
    })
    const [doors, setDoors] = useState<Door[]>([])
    
    useEffect(() => {
        const fetchDoors = async () => {
           
            const doors = await fetch(`/api/doors?locationId=${formData.locationId}`)
            const doorsData = await doors.json()
            setDoors(doorsData)
        }
        fetchDoors()
    }, [formData.locationId])
    return (
        <div>
            <h1>Card Form</h1>
            <form action={formAction} className="flex flex-col gap-2">
                <Label>Name</Label> 
                <Input type="text" name="name" placeholder="Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                {state.errors?.name && <p className="text-red-500">{state.errors.name[0]}</p>}
                <Label>User</Label>
                <Select name="userId" value={formData.userId} onValueChange={(value) => setFormData({...formData, userId: value})}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                        {staff.map((user) => (
                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {state.errors?.userId && <p className="text-red-500">{state.errors.userId[0]}</p>}
                <Label>Type</Label>
                <Select name="type" value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="key">Physical Key</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="rfid">RFID</SelectItem>
                        <SelectItem value="pin">Pin</SelectItem>
                        <SelectItem value="fob">Fob</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                {state.errors?.type && <p className="text-red-500">{state.errors.type[0]}</p>}
                <Label>Location</Label>

                <Select name="locationId" value={formData.locationId} onValueChange={(value) => setFormData({...formData, locationId: value})}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                        {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {state.errors?.locationId && <p className="text-red-500">{state.errors.locationId[0]}</p>}
                <Label>Door</Label>
                <Select name="doorId" value={formData.doorId} onValueChange={(value) => setFormData({...formData, doorId: value})}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Door" />
                    </SelectTrigger>
                    <SelectContent>
                        {doors.map((door) => (
                            <SelectItem key={door.id} value={door.id}>{door.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {state.errors?.doorId && <p className="text-red-500">{state.errors.doorId[0]}</p>}
                <Label>Description</Label>
                <Input type="text" name="description" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                {state.errors?.description && <p className="text-red-500">{state.errors.description[0]}</p>}
                <Button type="submit" disabled={pending}>{pending ? 'Creating...' : 'Create'}</Button>
            </form>
            {state.message && <p className="text-green-500">{state.message}</p>}
        </div>
    )
}