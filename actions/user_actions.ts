'use server'
import { prisma } from '@/lib/prisma';

export async function editUser(formData: FormData, id: string) {
  
    // Mutate data
    const name = formData.get('name') as string | null;
    const department = formData.get('department') as string | null;
    const jobTitle = formData.get('jobTitle') as string | null;
    const email = formData.get('email') as string | null;
    const location = formData.get('location') as string | null;

    if (!name || !department || !jobTitle || !email || !location) {
        throw new Error('All fields are required.');
    }

    try {
        // Perform the edit user action here
        const user = await prisma.user.update({
            where: { id: id },
            data: {
                name: name,
                department: department,
                jobTitle: jobTitle,
                email: email,
                location: location,
            },
        });
        console.log('User updated:', user);
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user.');
    }
    
    //we are not logged in so we will use a default user id
   
    }

export async function createUser(formData: FormData) {
    'use server'
    // Mutate data
    const name = formData.get('name') as string | null;
    const department = formData.get('department') as string | null;
    const jobTitle = formData.get('jobTitle') as string | null;
    const email = formData.get('email') as string | null;
    const location = formData.get('location') as string | null;

    if (!name || !department || !jobTitle || !email || !location) {
        throw new Error('All fields are required.');
    }

    try {
        // Perform the edit user action here
        const user = await prisma.user.create({
            data: {
                name: name,
                department: department,
                jobTitle: jobTitle,
                email: email,
                location: location,
            },
        });
        console.log('User created:', user);
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user.');
    }
}
export async function deleteUser(id: string) {
    'use server'
    //we are not logged in so we will use a default user id
    try {
        const user = await prisma.user.delete({
            where: { id: id },
        });
        console.log('User deleted:', user);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user.');
    }
}