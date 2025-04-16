'use client'

import { useActionState } from "react";
import { assignUserToSoftware } from "@/actions/software_actions";
import { User } from "@prisma/client";


const initialState = {
  message: '',
}

export default function AssignForm({id, availableUsers,authId}: {id: string, availableUsers: User[],authId: string}) {
    const [error, formAction, pending] = useActionState(assignUserToSoftware, initialState)
       
    return (<>
        <form action={formAction}>
        <select name="userId">
                {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}-{user.id}</option>
                ))}
            </select>
            <input type="text" name="grantedById"  defaultValue={authId} hidden />
            <input type="text" name="accessLevel" placeholder="Access Level*" />
            <input type="text" name="role" placeholder="Role*" />
            <input type="text" name="softwareId" value={id} readOnly hidden />
            <button type="submit">{pending ? 'Assigning...' : 'Assign Software +'}</button>
        </form>
        {error && <p>{error.message}</p>}
        </>
    )
}