'use server'
import { prisma } from '@/lib/prisma'
import { z } from "zod";
import { revalidatePath } from 'next/cache';
//import { redirect } from 'next/navigation';


type prevState = {message: string}

export async function createDepartment(prevState: prevState, formData: FormData) {
    // name: string;
    // description: string | null;
    // id: string;
    // createdAt: Date;
    // updatedAt: Date;
    // departmentHeadId: string | null;
    const schema = z.object({
        name: z.string().min(1),
        description: z.string().nullable(),
        departmentHeadId: z.string().uuid().nullable(),
    })
    const rawDepartmentHeadId = formData.get('departmentHeadId');
   
    const validatedFields = schema.safeParse({
        name: formData.get('name'),
        description: formData.get('description') as string | null,
        departmentHeadId: rawDepartmentHeadId ? rawDepartmentHeadId.toString() : null,
    })
    if (!validatedFields.success) {
        return {message: `Invalid fields ${validatedFields.error}`, error: validatedFields.error}
    }
    console.log(validatedFields.data)
    const validatedData = validatedFields.data
    const department = await prisma.department.create({
        data: validatedData
    })

    revalidatePath('/dashboard/departments')
    return {message: 'Department created successfully', error: '', result: `${department.id}`}
    //redirect(`/dashboard/departments/${department.id}`)
   
   
   
}

export async function deleteDepartment(id: string) {
    await prisma.department.delete({
        where: { id },
    })
}