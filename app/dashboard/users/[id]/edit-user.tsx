'use client'
import { editUser } from "@/actions/user_actions";
import { User } from "@prisma/client";
import { useActionState } from "react";

export default function EditUser({user, authId, users}: {user: User, authId: string, users: User[]}) {
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
            <input type="text" name="location" defaultValue={user.location || ''} />
            <select name="status">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
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