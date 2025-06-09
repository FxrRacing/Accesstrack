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

export async function updateSoftware(
  prevState: { message: string },
  formData: FormData
) {
  const id = formData.get('id') as string

  try {
    // Get current software data
    const currentSoftware = await prisma.software.findUnique({
      where: { id },
      
    })

    if (!currentSoftware) {
      return { message: 'Software not found', success: false }
    }

    // At the start of processing
   

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
    }

   // console.table(newData)
    // Find changed fields and build history entries in one pass
    const { updates, changes } = Object.entries(newData).reduce((acc, [key, value]) => {
      const field = key as SoftwareField
      const currentValue = currentSoftware[field]
      
      // Skip undefined values and null values (except for purchaseDate)
      if (value === undefined || (value === null && field !== 'purchaseDate')) {
        return acc
      }
      
      // Special handling for dates
      // if (field === 'purchaseDate') {
      //   switch (true) {
      //     case value === null:
      //       // New value is null, old value exists
      //       (acc.updates as Record<string, unknown>)[field] = null
      //       acc.changes.push({
      //         field,
      //         oldValue: currentValue ? new Date(currentValue).toISOString() : '',
      //         newValue: ''
      //       })
      //       return acc
      //     case currentValue === null:
      //       // Old value is null, new value exists
      //       (acc.updates as Record<string, unknown>)[field] = value
      //       acc.changes.push({
      //         field,
      //         oldValue: '',
      //         newValue: new Date(value).toISOString()
      //       })
      //       return acc
      //     default:
      //       // Both values exist, compare them
      //       const currentDate = new Date(currentValue).toISOString()
      //       const newDate = new Date(value).toISOString()
      //       if (currentDate !== newDate) {
      //         (acc.updates as Record<string, unknown>)[field] = value
      //         acc.changes.push({
      //           field,
      //           oldValue: currentDate,
      //           newValue: newDate
      //         })
      //       }
      //       return acc
      //   }
      // }
      
      // Compare other values as strings for consistency
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
     

    // console.log('Form Data:', {
    //   purchaseDate: formData.get('purchaseDate'),
    //   hasPurchaseDate: formData.has('purchaseDate'),
    //   currentPurchaseDate: currentSoftware.purchaseDate
    // })
    // // After processing
    // console.log('Processed Data:', {
    //   purchaseDate: newData.purchaseDate,
    //   currentPurchaseDate: currentSoftware.purchaseDate
    // })

    // During comparison
    // console.log('Date Comparison:', {
    //   field: 'purchaseDate',
    //   currentDate: currentSoftware.purchaseDate,
    //   newDate: newData.purchaseDate,
    //   isEqual: currentSoftware.purchaseDate === newData.purchaseDate
    // })

    // If no changes, return early
    if (changes.length === 0) {
      return { message: 'No changes detected', success: true }
    }
    
   // console.log(newData)
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
          updatedBy: id,
        }))
      })
    })

    revalidatePath(`/dashboard/software/${id}`)
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