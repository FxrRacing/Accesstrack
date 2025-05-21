'use client'

import { createKey } from "@/app/dashboard/keys&codes/actions"
import { Button } from "@/components/ui/button"
import { useActionState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"


const initialState = {
  message: '',
  errors: {} as Record<string, string[]>
}

export default function KeyForm() {
    const [state, formAction, pending] = useActionState(createKey, initialState)
    return (
        <div>
            <h1>Key Form</h1>
            <form action={formAction}>
                <div>
                    <Label>Name</Label>
                    <Input type="text" name="name" placeholder="Name" />
                    {state.errors?.name && <p className="text-red-500">{state.errors.name[0]}</p>}
                </div>
                <div>
                    <Label>User ID</Label>
                        <Input type="text" name="userId" placeholder="User ID" />
                    {state.errors?.userId && <p className="text-red-500">{state.errors.userId[0]}</p>}
                </div>
                <div>
                    <Label>Type</Label>
                    <Input type="text" name="type" placeholder="Type" />
                    {state.errors?.type && <p className="text-red-500">{state.errors.type[0]}</p>}
                </div>
                <div>
                    <Label>Door ID</Label>
                    <Input type="text" name="doorId" placeholder="Door ID" />
                    {state.errors?.doorId && <p className="text-red-500">{state.errors.doorId[0]}</p>}
                </div>
                <div>
                    <Label>Location ID</Label>
                    <Input type="text" name="locationId" placeholder="Location ID" />
                    {state.errors?.locationId && <p className="text-red-500">{state.errors.locationId[0]}</p>}
                </div>
                <div>
                    <Label>Description</Label>
                    <Input type="text" name="description" placeholder="Description" />
                    {state.errors?.description && <p className="text-red-500">{state.errors.description[0]}</p>}
                </div>
                <Button disabled={pending} type="submit">{pending ? 'Creating...' : 'Create Key'}</Button>
            </form>
            {state.message && <p className="text-green-500">{state.message}</p>}
        </div>
    )
}