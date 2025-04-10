"use server"
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';



export async function editSoftware(formData: FormData) {
    // Mutate data
    'use server'
    const id = formData.get('id') as string | null;
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const category = formData.get('category') as string | null;

    if (!name || !description || !category|| !id) {
        throw new Error('All fields are required.');
    }

    try {
        // Perform the edit user action here
        const software = await prisma.software.update({
            where: { id: id },
            data: {
                name: name,
                description: description,
                category: category,
            },
        });
        console.log('Software updated:', software);
        revalidatePath(`/dashboard/software/${id}`);
    } catch (error) {
        console.error('Error updating software:', error);
        throw new Error('Failed to update software.');
    }
}