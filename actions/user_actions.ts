'use server'
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';




export async function editUser(prevState: {message: string, success: boolean}, formData: FormData) {
  'use server'
   
    // Mutate data
    const name = formData.get('name') as string | null;
    const departmentId = formData.get('departmentId') as string | null;
    const jobTitle = formData.get('jobTitle') as string | null;
    const email = formData.get('email') as string | null;
    const locationId = formData.get('locationId') as string | null;
    const type = formData.get('type') as string | null;
    const status = formData.get('status') as string | null;
    const id = formData.get('id') as string | null;
    const reportsToId = formData.get('reportsToId') as string | null;
    const authId = formData.get('authId') as string | null;
    const onboardingDate = formData.get('onboardingDate') as string | null;
    const offboardingDate = formData.get('offboardingDate') as string | null;
    const personalEmail = formData.get('personalEmail') as string | null;
    
    if (!id || !authId) {
        return {message: 'User or Auth ID is required.', success: false}
    }

    // Validate ID format
   

    // Fetch the current user before update
    const currentUser = await prisma.user.findUnique({ where: { id: id! } });

    if (!currentUser) {
        return {message: 'User not found.', success: false}
    }

    const updates : Partial<User> = {
    }
if (departmentId != null)  updates.departmentId  = departmentId
if (email      != null)  updates.email       = email
if (type       != null)  updates.type        = type
// if (location   != null)  updates.locationId    = location
if (jobTitle   != null)  updates.jobTitle    = jobTitle
if (name       != null)  updates.name        = name
if (status     != null)  updates.status      = status
if (reportsToId != null)  updates.reportsToId = reportsToId
if (locationId != null)  updates.locationId  = locationId
if (onboardingDate && onboardingDate.trim() !== '') {
    updates.onboardingDate = new Date(onboardingDate);
} else {
    updates.onboardingDate = null;
}
if (offboardingDate && offboardingDate.trim() !== '') {
    updates.offboardingDate = new Date(offboardingDate);
} else {
    updates.offboardingDate = null;
}
if (personalEmail != null)  updates.personalEmail  = personalEmail

    try {
        if (reportsToId === "N/A" || reportsToId === null || reportsToId === "") {updates.reportsToId = null}
        // Perform the edit user action here
        
       
        console.table(updates)
        
        const user = await prisma.user.update({
            where: { id: currentUser.id },
            data: updates,
        });
      
        // Compare and create history entries
        const changes = Object.entries(updates).map(([field, newValue]) => {
            const oldValue = (currentUser as User)?.[field as keyof User];
            return {
                userId: id!,
                action: 'updated',
                field,
                oldValue: oldValue !== undefined && oldValue !== null ? String(oldValue) : null,
                newValue: newValue !== undefined && newValue !== null ? String(newValue) : null,
                updatedById: authId!,
            };
        });

        if (changes.length > 0) {
            await prisma.userHistory.createMany({ data: changes });
        }

        console.log('User updated:', user);
        revalidatePath(`/dashboard/users/${user.id}`);
        revalidatePath(`/dashboard/org-chart`);
        revalidatePath(`/dashboard/users`);
        return {message: 'User updated successfully', success: true}
    } catch (error) {
        console.error('Error updating user:', error);
        return {message: 'Failed to update user.', success: false}
    }
    
    //we are not logged in so we will use a default user id
   
    }

export async function createUser(prevState: {message: string, success: boolean}, formData: FormData) {
    'use server'
    // Mutate data
    const name = formData.get('name') as string | null;
    const departmentId = formData.get('departmentId') as string | null;
    const jobTitle = formData.get('jobTitle') as string | null;
    const email = formData.get('email') as string | null;
    const personalEmail = formData.get('personalEmail') as string | null;
    const locationId = formData.get('locationId') as string | null;
    let reportsTo = formData.get('reportsTo') as string | null;
    const status = formData.get('status') as string | null;
    const type = formData.get('type') as string | null;
    const onboardingDate = formData.get('onboardingDate') as string | null;
    const offboardingDate = formData.get('offboardingDate') as string | null;
    const authId = formData.get('authId') as string | null;
console.log(authId)
    if (!authId) {
        return {message: 'Auth ID is required.', success: false}
    }
    if (!name || !departmentId || !jobTitle || !email || !locationId) {
        return {message: 'All fields are required.', success: false}
    }


   if (reportsTo === "N/A") {reportsTo = null}

    try {
        // Perform the edit user action here
        const user = await prisma.user.create({
            data: {
                name: name,
                departmentId: departmentId,
                jobTitle: jobTitle,
                email: email,
                locationId: locationId,
                reportsToId: reportsTo ? reportsTo : null,
                personalEmail: personalEmail,
                status: status as string,
                type: type as string,
                onboardingDate: onboardingDate ? new Date(onboardingDate) : null,
                offboardingDate: offboardingDate ? new Date(offboardingDate) : null,
            },
        });
        // Add history entry
        await prisma.userHistory.create({
            data: {
                userId: user.id,
                action: 'created',
                field: 'all',
                oldValue: null,
                newValue: 'User created',
                updatedById: authId,
            }
        });
        console.log('User created:', user);
        //you will want to revalidate to the new user page
        revalidatePath(`/dashboard/users/${user.id}`);
        revalidatePath(`/dashboard/org-chart`);
        revalidatePath(`/dashboard/users`);
        return {message: 'User created successfully', success: true}
    } catch (error) {
        console.error('Error creating user:', error);
        return {message: 'Failed to create user.', success: false}
    }
}
export async function deleteUser(id: string ) {
    'use server'
    //we are not logged in so we will use a default user id
    try {
        const user = await prisma.user.delete({
            where: { id: id },
        });
        console.log('User deleted:', user);
        revalidatePath(`/dashboard/users`);
        redirect(`/dashboard/users`);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user.');
    }
}

export async function assignSoftware(formData: FormData) {
   
    //we are not logged in so we will use a default user id
    const softwareId = formData.get('softwareId') as string | null;
    const grantedById = formData.get('grantedById') as string| null;
    const accessLevel = formData.get('accessLevel') as string | null;
    const role = formData.get('role') as string | null;
    const userId = formData.get('userId') as string | null;
    if (!softwareId || !grantedById || !accessLevel || !role || !userId)  {
        throw new Error('All fields are required.');
    }

  console.table({
    softwareId,
    grantedById,
    accessLevel,
    role,
    userId,
  });

  const alreadyAssigned = await prisma.userSoftware.findFirst({
    where: { userId, softwareId },
  });
  
  if (alreadyAssigned) {
    throw new Error('This user already has access to this software.');
  }
    try {
        const userSoftware = await prisma.userSoftware.create({
            data: {
                userId: userId,
                softwareId: softwareId,
                grantedById: grantedById,
                accessLevel: accessLevel, // Replace 'default' with the appropriate value
                role: role, // Replace 'user' with the appropriate value
            },
        });
        //valudate the current userCount is correct,  count it 
        const userCount = await prisma.userSoftware.count({
            where: { softwareId: softwareId }
        });
        
  
        await prisma.software.update({
            where: { id: softwareId },
            data: { userCount: userCount },
        });
        //increment the userCount of the software
      
        console.log('User Software created:', userSoftware);
        revalidatePath(`/dashboard/users/${softwareId}`);
    } catch (error) {
        console.error('Error creating User Software:', error);
        throw new Error('Failed to create User Software.');
    }
}

export async function removeAssignedSoftware(userId: string, softwareId: string, authId: string) {
    'use server';
    try {
       await prisma.userSoftware.delete({
        where: {
          userId_softwareId: {
            userId: userId,
            softwareId: softwareId,
          },
        },
      });
      
      // Add history entry
      await prisma.userHistory.create({
        data: {
            userId: userId,
            action: 'removed_software',
            field: 'software',
            oldValue: softwareId,
            newValue: null,
            updatedById: authId, 
        }
      });
      
      revalidatePath(`/dashboard/software/${softwareId}`);  
    } catch (error) {
      console.error('Error deleting User Software:', error);
      throw new Error('Failed to delete User Software.');
    }
  }
  export async function removeUserFromSharedAccount(userId: string, sharedAccountId: string, authId: string) {
    'use server';
    try {
      await prisma.sharedAccountUser.delete({
      where:{
        sharedAccountId_userId: {
          sharedAccountId: sharedAccountId,
          userId: userId,
        },
      },
      });
      await prisma.sharedAccount.update({
        where: { id: sharedAccountId },
        data: { userCount: { decrement: 1 } },
      });
      await prisma.userHistory.create({
        data: {
          userId: userId,
          action: 'removed_shared_account',
          field: 'shared_account',
          oldValue: sharedAccountId,
          newValue: null,
          updatedById: authId,
        },
      });
      revalidatePath(`/dashboard/users/${userId}`);
    } catch (error) {
      console.error('Error deleting User from Shared Account:', error);
      throw new Error('Failed to delete User from Shared Account.');
    }
  }
  