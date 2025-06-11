'use server'

import { prisma } from "@/lib/prisma";

export async function deleteDepartment(id: string) {
    await prisma.department.delete({
        where: { id },
    });
}

export async function editDepartment({ id, name, description, departmentHeadId, }: { id: string, name: string, description: string, departmentHeadId: string | null, }) {
    return prisma.department.update({
        where: { id },
        data: {
            name,
            description,
            departmentHeadId,
           
        },
    });
}
