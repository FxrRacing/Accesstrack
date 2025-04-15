'use client'

import { useActionState } from "react";
import { assignUserToSoftware } from "@/actions/software_actions";

const initialState = {
  message: '',
}

export default function AssignForm({id}: {id: string}) {
    const [error, formAction, pending] = useActionState(assignUserToSoftware, initialState)
    return (<>
        <form action={formAction}>
            <input type="text" name="accessLevel" placeholder="Access Level*" />
            <input type="text" name="role" placeholder="Role*" />
            <input type="text" name="softwareId" value={id} readOnly hidden />
            <button type="submit">{pending ? 'Assigning...' : 'Assign Software +'}</button>
        </form>
        {error && <p>{error.message}</p>}
        </>
    )
}