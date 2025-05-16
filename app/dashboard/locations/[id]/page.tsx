import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AddDoor from "./addDoor";
export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const supabase = await createClient()
  
    const { data, error } = await supabase.auth.getUser()
    
    if (error || !data?.user) {
      redirect('/login')
    }
  
    const { id } = await params;
    const location = await prisma.location.findUnique({
        where: {
            id: id,
        },
        include: {
            _count: { select: { employees: true } },
            employees: true,
            doors: true,
        }
    });
    const departments = await prisma.department.findMany({})
    if (!location) {
        redirect('/dashboard/locations')
    }
    return (
<>

        <div>
            <h1>{location.name}</h1>
            <p>{location.address}</p>
            <p>{location.city}, {location.state}</p>
            <p>{location.country}</p>
            <p>{location.type}</p>
            <p>{location.postalCode}</p>
            <p>latitude: {location.latitude}</p>
            <p>longitude: {location.longitude}</p>
            <p>Employees: {location._count.employees}</p>
            {location.employees.map((employee) => (
                <p key={employee.id}>{employee.name}</p>
            ))}
            <AddDoor locationId={location.id}  departments={departments} />
            <h2>Doors</h2>
            <div>
                {location.doors.map((door) => (
                    <p key={door.id}>{door.name}</p>
                ))}
            </div>
        </div>

        </>

    )
}

// floor: formData.get('floor'),
//         type: formData.get('type'),
//         locationId: formData.get('locationId'),