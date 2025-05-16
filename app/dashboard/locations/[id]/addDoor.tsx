'use client'


import { DOOR_STATUS_OPTIONS, DOOR_TYPE_OPTIONS } from "@/utils/constants"
import { createDoor } from "../actions"
import { useActionState } from "react"
import { Department } from "@prisma/client"

const initialState = {message: '', errors: null}

export default function AddDoor({locationId, departments}: {locationId: string, departments: Department[]}) {
    const [state, formAction, isPending] = useActionState(createDoor, initialState)
    return (
        <form action={formAction}>
            <div>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" />
                <input type="hidden" name="locationId" value={locationId} readOnly />
                <label htmlFor="floor">Floor:</label>
                <input type="text" name="floor" />
                <label htmlFor="type">Type:</label>
                <select name="type">
                    {DOOR_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <label htmlFor="status">Status:</label>
                <select name="status">
                    {DOOR_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <label htmlFor="accessLevel">Primary Access Level:</label>
                <select name="accessLevel">
                    {departments.map((department) => (
                        <option key={department.name} value={department.name}>{department.name}</option>
                    ))}
                    <option value="all-staff">All Staff</option>


                </select>
                <button type="submit" disabled={isPending}>Add Door</button>
               
                {state.message && <p>{state.message}</p>}
            </div>
            
        </form>
    )
}
// floor: formData.get('floor'),
//         type: formData.get('type'),
//         locationId: formData.get('locationId'),

