'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function addLocation(prevState: { message: string }, formData: FormData) {
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const postalCode = formData.get('postalCode') as string
    const country = formData.get('country') as string
    const latitude = formData.get('latitude') as string
    const longitude = formData.get('longitude') as string
    const type = formData.get('type') as string
    
    const data = {
        name,
        address,
        city,
        state,
        postalCode,
        country,
        latitude,
        longitude,
        type
    }
    console.table(data)
   if (!name || !address || !city || !state || !postalCode || !country || !type ) {
    return {
        message: 'Please fill in all fields'
    }
   }
  
   try {
    await prisma.location.create({
        data: {
            name,
            address,
            city,
            state,
            postalCode,
            country,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            type
        }
    })
    revalidatePath('/dashboard/locations')
    return {
        message: 'Location added successfully'
    }
   } catch (error) {
    return {
        message: 'Error adding location ' + error
    }
   }
}

const doorSchema = z.object({
    name: z.string({invalid_type_error: 'Invalid name'}),
    floor: z.string({invalid_type_error: 'Invalid floor'}),
    type: z.string({invalid_type_error: 'Invalid type'}),
    locationId: z.string({invalid_type_error: 'Location is required'}),
    status: z.string({invalid_type_error: 'Status is required'}).optional(),
    accessLevel: z.string({invalid_type_error: 'Access level is required'}).optional(),
})

export async function createDoor(prevState: { message: string, errors: unknown }, formData: FormData) {
    const validatedFields = doorSchema.safeParse({
        name: formData.get('name'),
        floor: formData.get('floor'),
        type: formData.get('type'),
        status: formData.get('status'),
        accessLevel: formData.get('accessLevel'),
        locationId: formData.get('locationId'),
    })
    if (!validatedFields.success) {
        return {
          message: 'Invalid fields',
          errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    try {
        await prisma.door.create({
            data: {
                name: validatedFields.data.name,
                floor: validatedFields.data.floor,
                type: validatedFields.data.type,
                locationId: validatedFields.data.locationId,
                status: validatedFields.data.status,
                accessLevel: validatedFields.data.accessLevel,
            }
        })
        revalidatePath('/dashboard/locations')
        return {
            message: 'Door created successfully',
            errors: null,
        }
    } catch (error) {
        return {
            message: 'Error creating door ' + error,
            errors: error,
        }
    }
  
    
    
}