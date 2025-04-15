'use server'
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";


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

export async function assignSoftware(formData: FormData) {
   
    // Define a schema for validating the form data
    const assignSoftwareSchema = z.object({
        sharedAccountId: z.string().min(1, "Shared account ID is required"),
        softwareId: z.string().min(1, "Software ID is required"),
        grantedById: z.string().min(1, "Granted by ID is required"),
        accessLevel: z.string().min(1, "Access level is required"),
        role: z.string().min(1, "Role is required"),
    });
    
    try {
        // Parse and validate the form data
        const result = assignSoftwareSchema.safeParse({
            sharedAccountId: formData.get('sharedAccountId'),
            softwareId: formData.get('softwareId'),
            grantedById: formData.get('grantedById'),
            accessLevel: formData.get('accessLevel'),
            role: formData.get('role'),
        });
        
        // Use the validated data
       if (!result.success) {
        throw new Error('Invalid form data' + result.error.message);
       }
        console.table(result.data);   
        // The rest of your logic would go here

           await prisma.sharedAccountSoftware.create({
            data: {
                sharedAccountId: result.data.sharedAccountId,
                softwareId: result.data.softwareId,
                createdById: result.data.grantedById,
                accessLevel: result.data.accessLevel,
                role: result.data.role,
            },
           })
            revalidatePath(`/dashboard/shared-accounts/${result.data.sharedAccountId}`);
            revalidatePath('/dashboard/shared-accounts');
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Get the first error message
            const errorMessage = error.errors.map(e => e.message).join(", ");
            throw new Error(`Validation error: ${errorMessage}`);
        }
        throw error;
    }
}