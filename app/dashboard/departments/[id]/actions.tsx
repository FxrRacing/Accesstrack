'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteDepartment(id: string) {
    await prisma.department.delete({
        where: { id },
    });
    revalidatePath(`/dashboard/departments`)
    redirect(`/dashboard/departments`)
}

export async function editDepartment({ id, name, description, departmentHeadId, }: { id: string, name: string, description: string, departmentHeadId: string | null, }) {
     prisma.department.update({
        where: { id },
        data: {
            name,
            description,
            departmentHeadId,
           
        },
    });
    revalidatePath(`/dashboard/departments/${id}`)
    revalidatePath(`/dashboard/departments`)
}
