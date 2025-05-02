'use client'

import { createSoftware } from "@/actions/software_actions";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";


import { useFormStatus } from 'react-dom'
 

const initialState = {
    message: '',
  }

export function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button disabled={pending} type="submit">
      {pending ? 'Creating...' : 'Create Software'}
    </Button>
  )
}

export default function CreateForm() {
    const [error, formAction, pending] = useActionState(createSoftware, initialState )
    return (<>
        <form action={formAction} className="flex flex-col gap-4">
            <input type="text" name="name" placeholder="Name" />
            <input type="text" name="description" placeholder="Description" />
            <input type="text" name="category" placeholder="Category" />
            <input type="text" name="status" placeholder="Status" />
           <Button type="submit">{pending ? 'Creating...' : 'Create Software'}</Button>
        </form>
        {error && <p>{error.message}</p>}
        </>
    )
}