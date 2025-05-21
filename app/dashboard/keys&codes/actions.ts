'use server'


import { z } from "zod"

const keySchema = z.object({
  name: z.string().min(1, "Name is required"),
  userId: z.string().min(8, "User ID is required"),
  type: z.string().min(1, "Type is required"),
  doorId: z.string().min(8, "Door ID is required"),
  locationId: z.string().min(8, "Location ID is required"),
  description: z.string().optional(),
})


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
  doorId: z.string().min(8, "Door ID is required"),
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
  try {
   
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