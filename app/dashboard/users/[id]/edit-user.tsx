'use client'
import { editUser } from "@/actions/user_actions";
import { EMPLOYMENT_STATUS_OPTIONS } from "@/utils/constants";
import { User } from "@prisma/client";
import { useActionState } from "react";
import { Location } from "@prisma/client";

export default function EditUser({user, authId, users, locations}: {user: User, authId: string, users: User[], locations: Location[]}) {
    //providing total users temporarily
    const initialState = {
        message: '',
      }
      
    const [error, formAction, pending] = useActionState(editUser, initialState)
    return <div>
        <h1>Edit User</h1>
        <form action={formAction}>
            <input type="text" name="id" value={user.id} readOnly hidden  />
            <input type="text" name="name" defaultValue={user.name} />
            <input type="text" name="department" defaultValue={user.department} />
            <input type="text" name="jobTitle" defaultValue={user.jobTitle || ''} />
            <input type="text" name="email" defaultValue={user.email || ''} />
           <select name="location">
            {locations.map((location: Location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
           </select>
            <select name="status">
                {EMPLOYMENT_STATUS_OPTIONS.map((option: { value: string; label: string }) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
            </select>
            <input type="text" name="authId" value={authId} readOnly hidden />
            <label htmlFor="reportsToId">Reports To</label>
            <select name="reportsToId">
                {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            <button type="submit">{pending ? 'Updating...' : 'Update'}</button>
            {error && <p>{error.message}</p>}
        </form>

       
    </div>
}