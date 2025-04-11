import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function createSharedAccount(formData: FormData) {
    'use server'
    // Mutate data
    const name = formData.get('name') as string | null;
    const email = formData.get('email') as string | null;
    const location = formData.get('location') as string | null;
const type = formData.get('type') as string | null;
const status = formData.get('status') as string | null;
const updatedBy = formData.get('updatedBy') as string | null;


if (!name || !email || !location || !type || !status || !updatedBy) {
    throw new Error('All fields are required.');
}
const normalizedName = name.toLowerCase().replace(/\s+/g, '');
try {
    await prisma.sharedAccount.create({
        data: {
            name,
            normalizedName,
            email,
            location,
            type,
            status,
            updatedById: updatedBy,
        },
    });
    revalidatePath('/dashboard/shared-accounts');
} catch (error) {
    console.error('Error creating shared account:', error);
    throw new Error('Failed to create shared account.');
}
}