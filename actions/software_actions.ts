"use server"
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createSoftware(prevState: {message: string},formData: FormData) {
    'use server'
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const category = formData.get('category') as string | null;
    const status = formData.get('status') as string | null;
    const website = formData.get('website') as string | null;
    const icon = formData.get('icon') as string | null;
    const teamOwnerId = formData.get('teamOwnerId') as string | null;
    //team
    if (!name || !description || !category || !status   || !icon) {
        return {message: 'All fields are required.'}
    }
    let strippedWebsite 
      if(website){
        strippedWebsite = stripProtocol(website);
        console.log(strippedWebsite)
      }
    
    const data = {
      name,
      description,
      category,
      status,
      website,
      iconUrl: icon,
      teamOwnerId: teamOwnerId,
      
    }
    console.table(data)

    try {
      await prisma.software.create({
        data: data,
      });
      revalidatePath('/dashboard/software');
      return { message: 'success' }
    } catch (error) {
        console.error('Error creating software:', error);
        return { message: 'Please enter a valid email' }
    }
}

async function stripProtocol(website: string) {
    return website.replace(/^https?:\/\//, '');
}


export async function editSoftware(formData: FormData) {
    // Mutate data
    'use server'
    const id = formData.get('id') as string | null;
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const category = formData.get('category') as string | null;
    const status = formData.get('status') as string | null;

    if (!name || !description || !category|| !status || !id) {
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
                status: status,
            },
        });
        console.log('Software updated:', software);
        revalidatePath(`/dashboard/software/${id}`);
    } catch (error) {
        console.error('Error updating software:', error);
        throw new Error('Failed to update software.');
    }
}




  export async function removeAssignedUser(userId: string, softwareId: string) {
    'use server';
    console.table({userId, softwareId})
    try {
        await prisma.userSoftware.delete({
            where: {
              userId_softwareId: {
                userId: userId,
                softwareId: softwareId,
              },
            },
          });
          // update count of users in software
          const software = await prisma.software.findUnique({
            where: { id: softwareId },
          });
          if (software && software.userCount && software.userCount > 0) {
            await prisma.software.update({
                where: { id: softwareId },
                data: { userCount: software.userCount - 1 },
            });
          }
      revalidatePath(`/dashboard/software/${softwareId}`);
    } catch (error) {
      console.error('Error deleting User Software:', error);
      throw new Error('Failed to delete User Software.');
    }
  }


  export async function assignUserToSoftware(prevState: {message: string},formData: FormData) {
   
    //we are not logged in so we will use a default user id
    const softwareId = formData.get('softwareId') as string | null;
    const grantedById = formData.get('grantedById') as string| null;
    const accessLevel = formData.get('accessLevel') as string | null;
    const role = formData.get('role') as string | null;
    const userId = formData.get('userId') as string | null;
    if (!softwareId || !grantedById || !accessLevel || !role || !userId)  {
        return {message: 'All fields are required.'}
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
    return {message: 'This user already has access to this software.'}
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
        revalidatePath(`/dashboard/software/${softwareId}`);
        return {message: 'success'}
    } catch (error) {
        console.error('Error creating User Software:', error);
        return {message: 'Failed to create User Software.'}
    }
}