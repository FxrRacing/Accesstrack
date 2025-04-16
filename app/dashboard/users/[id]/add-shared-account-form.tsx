'use client'

import { SharedAccount } from "@prisma/client"
import { useActionState } from "react"
import { addUserToSharedAccount } from "@/actions/sharedAccount_actions"
export default function AddSharedAccountForm({id, availableSharedAccounts, authId}: {id: string, availableSharedAccounts: SharedAccount[], authId: string}) {
    const initialState = {
        message: '',
      }
    const [error, formAction, pending] = useActionState(addUserToSharedAccount, initialState)
    return <div>
        <h1>Add Shared Account</h1>
        <form action={formAction}>
            <input type="text" name="userId" value={id} hidden />
            <input type="text" name="authId" value={authId} hidden />
            <select name="sharedAccountId">
                {availableSharedAccounts.map((sharedAccount) => (
                    <option key={sharedAccount.id} value={sharedAccount.id}>{sharedAccount.name}</option>
                ))}
            </select>
            <button type="submit">{pending ? 'Adding...' : 'Add'}</button>
            {error && <p>{error.message}</p>}
        </form>
    </div>
}