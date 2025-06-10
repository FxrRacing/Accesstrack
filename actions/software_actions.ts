"use server"
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { paymentFrequency } from "@/lib/constants"
import { PaymentMethod, PaymentFrequency as PrismaPaymentFrequency } from "@prisma/client"
import { Software } from "@prisma/client"

type SoftwareField = keyof Software

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
        return { message: 'Error creating software.' }
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


  export async function assignUserToSoftware(prevState: {message: string, success: boolean}, formData: FormData) {
    try {
      // Get assignments from form data
      const assignments = formData.getAll('assignments').map(assignment => JSON.parse(assignment as string)) as Array<{
        userId: string;
        role: string;
        accessLevel: string;
      }>;
      const softwareId = formData.get('softwareId') as string;
      const grantedById = formData.get('grantedById') as string;

      // Validate required fields
      if (!assignments.length) {
        return {
          success: false,
          message: 'Please select at least one user'
        };
      }

      if (!softwareId || !grantedById) {
        return {
          success: false,
          message: 'Missing required fields: software ID or granted by ID'
        };
      }

      // Execute transaction
      await prisma.$transaction(async (tx) => {
        for (const assignment of assignments) {
          try {
            // Check if user is already assigned
            const alreadyAssigned = await tx.userSoftware.findFirst({
              where: { 
                userId: assignment.userId, 
                softwareId 
              },
              include: {
                user: true
              }
            });

            if (alreadyAssigned) {
              throw new Error(`User ${alreadyAssigned.user.name} already has access to this software.`);
            }

            // Create user software assignment
            const userSoftware = await tx.userSoftware.create({
              data: {
                userId: assignment.userId,
                softwareId,
                grantedById,
                accessLevel: assignment.accessLevel,
                role: assignment.role,
              },
              include: {
                user: true
              }
            });

            // Create history entry
            await tx.softwareHistory.create({
              data: {
                softwareId,
                action: 'Assigned User',
                field: 'users',
                oldValue: null,
                newValue: userSoftware.user.name,
                updatedById: grantedById,
              }
            });
          } catch (error) {
            console.error('Error processing assignment:', error);
            throw error;
          }
        }

        // Update user count
        const userCount = await tx.userSoftware.count({
          where: { softwareId }
        });

        await tx.software.update({
          where: { id: softwareId },
          data: { userCount }
        });
      });

      // Revalidate paths
      revalidatePath(`/dashboard/software/${softwareId}`);
      revalidatePath('/dashboard/software');

      return {
        success: true,
        message: `Successfully assigned ${assignments.length} user${assignments.length === 1 ? '' : 's'} to the software`
      };
    } catch (error) {
      console.error('Error in assignUserToSoftware:', error);
      return {
        success: false,
        message: `Failed to assign users: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

export async function updateSoftware(
  prevState: { message: string },
  formData: FormData
) {
  const id = formData.get('id') as string
  const authId = formData.get('authId') as string
  console.log(authId)

  try {
    // Get current software data
    const currentSoftware = await prisma.software.findUnique({
      where: { id },
    })

    if (!currentSoftware) {
      return { message: 'Software not found', success: false }
    }

    // Parse form data into clean update object
    const newData: Partial<Software> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      status: formData.get('status') as string,
      website: formData.get('website') as string,
      iconUrl: formData.get('iconUrl') as string,
      amount: formData.get('amount') ? parseFloat(formData.get('amount') as string) : undefined,
      currency: formData.get('currency') as string,
      licenseType: formData.get('licenseType') as string,
      pricePerUser: formData.get('pricePerUser') ? parseFloat(formData.get('pricePerUser') as string) : undefined,
      purchaseDate: formData.has('purchaseDate') ? 
        (formData.get('purchaseDate') === 'null' ? null : new Date(formData.get('purchaseDate') as string)) 
        : undefined,
      paymentFrequency: formData.get('paymentFrequency') ? 
        paymentFrequency[formData.get('paymentFrequency') as keyof typeof paymentFrequency] as PrismaPaymentFrequency : 
        undefined,
      paymentMethod: formData.get('paymentMethod') as PaymentMethod,
      accountRep: formData.get('accountRep') as string,
      notes: formData.get('notes') as string,
    }

    // Find changed fields and build history entries in one pass
    const { updates, changes } = Object.entries(newData).reduce((acc, [key, value]) => {
      const field = key as SoftwareField
      const currentValue = currentSoftware[field]
      
      // Skip undefined values and null values (except for purchaseDate)
      if (value === undefined || (value === null && field !== 'purchaseDate')) {
        return acc
      }
      
      // Compare values as strings for consistency
      const currentStr = currentValue?.toString() || ''
      const newStr = value?.toString() || ''
      
      if (currentStr !== newStr) {
        (acc.updates as Record<string, unknown>)[field] = value
        acc.changes.push({
          field,
          oldValue: currentStr,
          newValue: newStr
        })
      }
      return acc
    }, { 
      updates: {} as Partial<Software>, 
      changes: [] as Array<{ field: string; oldValue: string; newValue: string }> 
    })

    // If no changes, return early
    if (changes.length === 0) {
      return { message: 'No changes detected', success: true }
    }
    
    await prisma.$transaction(async (tx) => {
      // Update software
      await tx.software.update({
        where: { id },
        data: updates
      })

      // Bulk create history entries
      await tx.softwareHistory.createMany({
        data: changes.map(change => ({
          softwareId: id,
          action: 'updated',
          field: change.field,
          oldValue: change.oldValue,
          newValue: change.newValue,
          updatedById: authId,
        }))
      })
    })

    revalidatePath(`/dashboard/software/${id}`)
    revalidatePath(`/dashboard/software/`)
    return { 
      message: 'Software updated successfully', 
      success: true 
    }
  } catch (error) {
    console.error('Error updating software:', error)
    return { 
      message: 'Failed to update software', 
      success: false 
    }
  }
}