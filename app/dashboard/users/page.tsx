import { createUser } from "@/actions/user_actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateUserForm from "./create-user-form";
import { UsersTable } from "./table";
import { User } from "@prisma/client";


export default async function UsersPage() {  
     const users: (User & { reportsTo: User | null })[] = await prisma.user.findMany({
        orderBy: {
            name: 'asc',
        },
        include: {
            reportsTo: true,
        },
     });
    return (
        <div>
            <h1 className="text-2xl font-bold">Users</h1>
            


            
            <UsersTable data={users} />
            {/* =====

            {users.map((user) => (
                
                <div key={user.id}>
                    <Link  href={`/dashboard/users/${user.id}`}><h2>{`-->`}{user.name}</h2></Link>
                    
                    <p className="text-green-700">Department: {user.department}</p>
                    <p className="text-green-700">Job Title: {user.jobTitle}</p>
                    <p className="text-green-700">Email: {user.email}</p>
                    <p className="text-green-700">Location: {user.location}</p>
                    <p className="text-green-700">Reports To: {user.reportsTo?.name}</p>
                </div>
               
            ))} */}


            ==========================================
            <h2>Create User</h2>

            <CreateUserForm users={users} />
            =====   
            <form action={createUser} className='flex flex-col gap-4'>
                <input type="text" name="name" placeholder="Name*" />
                <input type="text" name="department" placeholder="Department*" />
                <input type="text" name="jobTitle" placeholder="Job Title" />
                <input type="text" name="email" placeholder="Email" />
                <input type="text" name="location" placeholder="Location" />
                <button type="submit">Create User +</button>
            </form>
        </div>
    );
}