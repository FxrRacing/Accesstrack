'use server'


import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { useMockService } from "@/lib/devToolsStore"

const keySchema = z.object({
  name: z.string().min(1, "Name is required"),
  userId: z.string().min(8, "User ID is required"),
  type: z.string().min(1, "Type is required"),
  doorId: z.string().min(8, "Door ID is required"),
  locationId: z.string().min(8, "Location ID is required"),
  description: z.string().optional(),
})


//if mock mode is on, return a mock response 


export async function createKey(prevState: {message: string, errors: Record<string, string[]>}, formData: FormData) {
  const validatedFields = keySchema.safeParse({
    name: formData.get('name'),
    userId: formData.get('userId'),
    type: formData.get('type'),
    doorId: formData.get('doorId'),
    locationId: formData.get('locationId'),
    description: formData.get('description'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: ''
    }
  }

  // Proceed with creating the key
  try {
    console.table(validatedFields)
     await prisma.key.create({
      data: {
        name: validatedFields.data.name,
        userId: validatedFields.data.userId,
        type: validatedFields.data.type,
        doorId: validatedFields.data.doorId,
        locationId: validatedFields.data.locationId,
        description: validatedFields.data.description || '',
      },
    })
    revalidatePath('/dashboard/keys&codes')
    // Your key creation logic here
    return {
      message: 'Key created successfully',
      errors: {}
    }
  } catch (error) {
    console.error('Error creating key:', error);
    return {
      message: `Failed to create key: ${error}`,
      errors: {}
    }
  }
  
}


const keyCardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  userId: z.string().min(8, "User ID is required"),
  type: z.string().min(1, "Type is required"),
  doorIds: z.array(z.string()).min(1, "At least one door is required"),
  locationId: z.string().min(8, "Location ID is required"),
  description: z.string().optional(),
})

// id String @id @default(uuid()) @db.Uuid
//   name String
//   description String? 
//   createdAt DateTime @default(now()) @db.Timestamptz(6)
//   updatedAt DateTime @updatedAt @db.Timestamptz(6)
//   type String
//   doors KeyCardDoor[]
//   userId String? @db.Uuid
//   user User? @relation(fields: [userId], references: [id])
//   // multiple locations can have the same keycard
//   locations KeyCardLocation[]


export async function createKeyCard(prevState: {message: string, errors: Record<string, string[]>}, formData: FormData) {
  const validatedFields = keyCardSchema.safeParse({
    name: formData.get('name'),
    userId: formData.get('userId'),
    type: formData.get('type'),
    doorIds: formData.getAll('doorIds'), // Get all door IDs from the form
    locationId: formData.get('locationId'),
    description: formData.get('description'),
  })

  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: ''
    }
  }
  try {
    console.table(validatedFields)
    await prisma.keyCard.create({
      data: {
        name: validatedFields.data.name,
        userId: validatedFields.data.userId,
        type: validatedFields.data.type,
        description: validatedFields.data.description || '',
        doors: {
          create: validatedFields.data.doorIds.map(doorId => ({
            door: {
              connect: { id: doorId }
            }
          }))
        },
        locations: {
          create: {
            location: {
              connect: { id: validatedFields.data.locationId }
            }
          }
        }
      },
    })
   
    revalidatePath('/dashboard/keys&codes')
    return {
      message: 'Key card created successfully',
      errors: {}
    }
  } catch (error) {
    console.error('Error creating key card:', error);
    return {
      message: `Failed to create key card: ${error}`,
      errors: {}
    }
  }
}