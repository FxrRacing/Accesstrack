'use client'

import { Input } from "@/components/ui/input"
import { createKeyCard } from "./actions"
import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>
  }
export default function CardForm() {
    const [state, formAction, pending] = useActionState(createKeyCard, initialState)
    const [formData, setFormData] = useState({
        name: '',
       
        type: '',
        
        description: ''
    })
    return (
        <div>
            <h1>Card Form</h1>
            <form action={formAction}>
                <Label>Name</Label> 
                <Input type="text" name="name" placeholder="Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                {state.errors?.name && <p className="text-red-500">{state.errors.name[0]}</p>}
                <Label>User ID</Label>
                <Input type="text" name="userId" placeholder="User ID" required />
                {state.errors?.userId && <p className="text-red-500">{state.errors.userId[0]}</p>}
                <Label>Type</Label>
                <Input type="text" name="type" placeholder="Type" required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} />
                {state.errors?.type && <p className="text-red-500">{state.errors.type[0]}</p>}
                <Label>Door ID</Label>
                <Input type="text" name="doorId" placeholder="Door ID" required />
                {state.errors?.doorId && <p className="text-red-500">{state.errors.doorId[0]}</p>}
                <Label>Location ID</Label>
                <Input type="text" name="locationId" placeholder="Location ID" required />
                {state.errors?.locationId && <p className="text-red-500">{state.errors.locationId[0]}</p>}
                <Label>Description</Label>
                <Input type="text" name="description" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                {state.errors?.description && <p className="text-red-500">{state.errors.description[0]}</p>}
                <Button type="submit" disabled={pending}>{pending ? 'Creating...' : 'Create'}</Button>
            </form>
            {state.message && <p className="text-green-500">{state.message}</p>}
        </div>
    )
}