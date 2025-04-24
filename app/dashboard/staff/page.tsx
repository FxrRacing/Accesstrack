
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "../shared-accounts/data-table";

export default async function StaffPage() {
    const staff = await prisma.userProfiles.findMany();  

    return (
        <div className="flex flex-col gap-4 p-3">
            <h1>Staff</h1>

            <DataTable columns={columns} data={staff} />


            
            <div className="flex flex-col gap-4">
            {staff.map((staff) => (
                <Card key={staff.id} className="flex flex-col gap-4">
                    <Link href={`/dashboard/staff/${staff.id}`}>
                        <h2 className="text-2xl font-bold">{staff.email}</h2>
                    </Link>
                    <div className="flex flex-row gap-4">
                      
                        <p>email: {staff.email}</p>
                        <p>phone: {staff.phone}</p>
                    </div>
                </Card>
            ))}
            </div>
================
<br />
            <Button>Add Staff</Button>
        </div>
    )
}

