import { prisma } from "@/lib/prisma"
import AddUserForm from "./add-user-form"
import Link from "next/link"


export default async function Users({id, authId}: {id: string, authId: string}) {
    
    
    const currentUsers = await prisma.sharedAccountUser.findMany({
        where: {
            sharedAccountId: id
        },
        include: {
            user: true,
            createdBy: true
        }
    })
   const currentUsersIds = currentUsers.map((user) => user.user.id)
   const availableUsers = await prisma.user.findMany({
    where: {
        id: {
            notIn: currentUsersIds
        }
    }
   })

    return <div>
        <h1>Users</h1>
      
        {currentUsers.map((user) => (
            <div key={user.id}>
                <Link href={`/dashboard/users/${user.user.id}`}><p>name: {user.user.name}</p></Link>
                <p>email: {user.user.email}</p>
                <p>grantedBy: {user.createdBy.email}</p>
                <p>assignedAt: {user.assignedAt.toLocaleDateString()}</p>
            </div>
        ))}
        <AddUserForm id={id} availableUsers={availableUsers} authId={authId} />
    </div>
}