'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

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