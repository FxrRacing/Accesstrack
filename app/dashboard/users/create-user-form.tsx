'use client'

import { createUser } from "@/actions/user_actions"
import { User } from "@prisma/client";



export default function CreateUserForm({users}: {users: User[]} ) {
  

  return(
    <form action={createUser} className='flex flex-col gap-4'>
                <input type="text" name="name" placeholder="Name*" />
                <input type="text" name="department" placeholder="Department*" />
                <input type="text" name="jobTitle" placeholder="Job Title" />
                <input type="text" name="email" placeholder="Email" />
                <input type="text" name="location" placeholder="Location" />
                <label htmlFor="reportsTo">Reports To</label>
                <select name="reportsTo" >
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
                <button type="submit">Create User +</button>
            </form>
  )
}