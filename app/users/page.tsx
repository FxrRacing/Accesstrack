import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function UsersPage() {  
     const users= await prisma.user.findMany({});
    return (
        <div>
            <h1>Users</h1>
            <p>Users page content goes here.</p>
            {users.map((user) => (
                
                <div key={user.id}>
                    <Link  href={`/users/${user.id}`}><h2>{`--->`}{user.name}</h2></Link>
                    
                    <p className="text-green-700">Department: {user.department}</p>
                    <p className="text-green-700">Job Title: {user.jobTitle}</p>
                    <p className="text-green-700">Email: {user.email}</p>
                    <p className="text-green-700">Location: {user.location}</p>
                </div>
               
            ))}
        </div>
    );
}