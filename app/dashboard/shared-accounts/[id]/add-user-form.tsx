'use client'


import { addUserToSharedAccount } from "@/actions/sharedAccount_actions"
import { User } from "@prisma/client"
import { useActionState } from "react"

const initialState = {
    message: '',
  }
export default function AddUserForm({id, availableUsers, authId}: {id: string, availableUsers: User[], authId: string}) {
    const [error, formAction, pending] = useActionState(addUserToSharedAccount, initialState)
    return <div>
        <h1>Add User</h1>
      ====
        <form action={formAction}>
            <input type="text" name="sharedAccountId" value={id} hidden readOnly />
            <input type="text" name="authId" value={authId} hidden readOnly />
            <select name="userId">
                {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            <button type="submit">{pending ? 'Adding...' : 'Add'}</button>
            {error && <p>{error.message}</p>}
        </form>
    </div>
}
