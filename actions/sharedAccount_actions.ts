'use server'
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
//import { redirect } from "next/navigation";
import { z } from "zod";


const createSharedAccountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    location: z.string().min(1, "Location is required"),
    type: z.string().min(1, "Type is required"),
    status: z.string().min(1, "Status is required"),
    updatedBy: z.string().min(1, "Updated by is required"),
})


export async function createSharedAccount(prevState: { message: string, errors: Record<string, string[]> | null }, formData: FormData) {
    'use server'
    // Mutate data
    const validatedFields = createSharedAccountSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        location: formData.get('location'),
        type: formData.get('type'),
        status: formData.get('status'),
        updatedBy: formData.get('updatedBy'),
    })

    if (!validatedFields.success) {
        return { message: 'All fields are required.', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { name, email, location, type, status, updatedBy } = validatedFields.data;

let id = '';
const normalizedName = name.toLowerCase().replace(/\s+/g, '');
try {
    const sharedAccount = await prisma.sharedAccount.create({
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
    id = sharedAccount.id;
    revalidatePath('/dashboard/shared-accounts');
    
    return { message: 'success', id, errors: null };
} catch (error) {   
    console.error('Error creating shared account:', error);
    return { message: 'Failed to create shared account.', errors: null };
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
    } catch (error) {
        console.error('Error assigning software:', error);
        if (error instanceof z.ZodError) {
            // Get the first error message
            const errorMessage = error.errors.map(e => e.message).join(", ");
            throw new Error(`Validation error: ${errorMessage}`);
        }
        throw error;
    }
   
    revalidatePath('/dashboard/shared-accounts');
}

export async function removeAssignedSoftware(prevState: {message: string}, formData: FormData) {
    try {
            const id = formData.get('id') as string;
            const sharedAccountId = formData.get('sharedAccountId') as string;
            const authId = formData.get('authId') as string;
            const softwareId = formData.get('softwareId') as string;

       console.table({id, sharedAccountId, authId, softwareId})

        const existingSharedAccountSoftware = await prisma.sharedAccountSoftware.findFirst({
            where: {
                id: id
            },
            include: {
                software: true
            }
        })
        
        if (!existingSharedAccountSoftware) {
            return { message: 'Software not found in shared account.' };
        }
        await prisma.sharedAccountSoftware.delete({
            where: {
                id: id
            }
        })
        await prisma.sharedAccountHistory.create({
            data: {
                action: "Removed Software from Shared Account",
                sharedAccountId: sharedAccountId,
                field: "software",
                oldValue: existingSharedAccountSoftware.software.name,
                newValue: null, 
                updatedById: authId,
            },
        })
        revalidatePath(`/dashboard/shared-accounts/${sharedAccountId}`)
        revalidatePath('/dashboard/shared-accounts')
        revalidatePath(`/dashboard/software/${softwareId}`)
        return { message: 'Software removed from shared account.' };
    } catch (error) {
        console.error('Error removing assigned software:', error);
        return { message: 'Failed to remove assigned software.' };
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
       
       const sharedAccountUser = await prisma.sharedAccountUser.create({
            data: {
                sharedAccountId: result.data.sharedAccountId,
                userId: result.data.userId,
                createdById: result.data.authId,
            },
            include: {
                user: true
            }
    })
    await prisma.sharedAccountHistory.create({
        data: {
            action: "Assigned User",
            sharedAccountId: result.data.sharedAccountId,
            field: "users",
            oldValue: null,
            newValue: sharedAccountUser.user.name,
            updatedById: result.data.authId,
        },
    })
    // Update the user count
    await prisma.sharedAccount.update({
        where: {
            id: result.data.sharedAccountId
        },
        data: {
            userCount: { increment: 1 }
        }
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

export async function unassignUserFromSharedAccount(prevState: {message: string}, formData: FormData) {
    try {
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const sharedAccountId = formData.get('sharedAccountId') as string;
        const authId = formData.get('authId') as string;
        if (!id || !sharedAccountId || !authId || !name) {
            return { message: 'All fields are required.' };
        }

        await prisma.sharedAccountUser.delete({
            where: {
                sharedAccountId_userId: {
                    sharedAccountId: sharedAccountId,
                    userId: id
                }
            }
        })
        await prisma.sharedAccount.update({
            where: {
                id: sharedAccountId
            },
            data: {
                updatedAt: new Date()
            }
        })
        await prisma.sharedAccountHistory.create({
            data: {
                action: "Unassigned User",
                sharedAccountId: sharedAccountId,
                field: "users",
                oldValue: name,
                newValue: null,
                updatedById: authId,
            },
        })
        revalidatePath(`/dashboard/users/${sharedAccountId}`)
        revalidatePath(`/dashboard/shared-accounts/${sharedAccountId}`)
        return { message: 'User unassigned from shared account.' };
    } catch (error) {
        console.error('Error unassigning user from shared account:', error);
        return { message: 'Failed to unassign user from shared account.' };
    }
}
