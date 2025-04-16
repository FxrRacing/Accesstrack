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


export async function addUserToSharedAccount(prevState: {message: string}, formData: FormData) {
   

    const assignUserSchema = z.object({
        sharedAccountId: z.string().min(1, "Shared account ID is required"),
        userId: z.string().min(1, "User ID is required"),
        authId: z.string().min(1, "Auth ID is required"),
    });
    try {
        const result = assignUserSchema.safeParse({
            sharedAccountId: formData.get('sharedAccountId'),
            userId: formData.get('userId'),
            authId: formData.get('authId'),
        }
           
        );
        if (!result.success) {
            console.log(result.error)
            return { message: 'Invalid form data', errors: result.error.message };
        }
        console.table(result.data);
        await prisma.sharedAccountUser.create({
            data: {
                sharedAccountId: result.data.sharedAccountId,
                userId: result.data.userId,
                createdById: result.data.authId,
            },
    })
    await prisma.sharedAccountHistory.create({
        data: {
            action: "Assigned User",
            sharedAccountId: result.data.sharedAccountId,
            field: "users",
            oldValue: null,
            newValue: result.data.userId,
            updatedById: result.data.authId,
        },
    })
    revalidatePath(`/dashboard/shared-accounts/${result.data.sharedAccountId}`)
    revalidatePath('/dashboard/shared-accounts')
    revalidatePath(`/dashboard/users/${result.data.userId}`)
    return { message: 'User added to shared account.',  };
   } catch (error) {
    console.error('Error adding user to shared account:', error);
    return { message: 'Failed to add user to shared account.' };
   }
}

// export async function deleteSharedAccount(id: string, sharedAccountId: string) {
//     await prisma.sharedAccountUser.delete({
//         where: {
//             id: id
//         }
//     })
//     await prisma.sharedAccountHistory.create({
//         data: {
//             action: "Deleted Shared Account",
//             sharedAccountId: sharedAccountId,
//             field: "users",
//             oldValue: id,
//             newValue: null,
//             updatedBy: sharedAccountId,
//         },
//     })
//     revalidatePath(`/dashboard/users/${sharedAccountId}`)
// }