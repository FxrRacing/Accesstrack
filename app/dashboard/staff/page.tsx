
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StaffPage() {
    const staff = await prisma.userProfiles.findMany();  

    return (
        <div>
            <h1>Staff</h1>
            {staff.map((staff) => (
                <div key={staff.id}>
                    <Link href={`/dashboard/staff/${staff.id}`}>
                        <h2> {`-->`}{staff.email}</h2>
                    </Link>
                    <p>email: {staff.email}</p>
                    <p>phone: {staff.phone}</p>
                </div>
            ))}
        </div>
    )
}

