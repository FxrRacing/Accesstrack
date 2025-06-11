'use server'

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import {  serviceRoleClient } from '@/utils/supabase/admin';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Role } from '@/types/permissions';
import { banDurations } from './[id]/ban-access';



export async function changeRole(prevState: {success: boolean, message: string, errors: Record<string, string[]>}, formData: FormData) {
    
    const changeRoleSchema = z.object({
        id: z.string().min(1, "ID is required"),
        role: z.string().min(1, "Role is required"),
        grantedById: z.string().min(1, "Granted by ID is required"),
    })
    const result = changeRoleSchema.safeParse({
        id: formData.get('id'),
        role: formData.get('role'),
        grantedById: formData.get('grantedById'),
    })
    if (!result.success) {
        return { success: false, message: 'Invalid form data', errors: result.error.flatten().fieldErrors }
    }
    const user = await prisma.users.findUnique({
        where: {
            id: result.data.id,
        },
    })
    if (!user) {
        return { success: false, message: 'User not found', errors: { message: ['User not found'] } }
    }
    
    try {
        await serviceRoleClient.auth.admin.updateUserById(result.data.id, {
            role: result.data.role
        })
         await prisma.users.update({
            where: {
                id: result.data.id,
            },
            data: {
                raw_user_meta_data: {
                    ...(typeof user.raw_user_meta_data === 'object' && user.raw_user_meta_data !== null ? user.raw_user_meta_data : {}),
                    role: result.data.role as Role,
                   
                },
            },
        })
    } catch (error) {
        console.error('Error changing role:', error)
        return { success: false, message: '', errors: { message: ['Failed to change role'] } }
    }
    console.log(result.data.role)
    revalidatePath('/dashboard/staff', 'layout')
    revalidatePath(`/dashboard/staff/${result.data.id}`)
    return { success: true, message: 'Role changed successfully', errors: { message: ['Role changed successfully'] } }
}






export async function createInvite(prevState: {message: string}, formData: FormData) {
    



    const email = formData.get('email') as string
    const fullName = formData.get('name') as string
    const role = formData.get('role') as string
    const team = formData.get('team') as string
    const createdById = formData.get('createdById') as string
    console.table({email, fullName, role, team, createdById})
    if (!email || !fullName || !role || !team || !createdById) {
        return { message: 'Please fill in all fields' }
    }
   try {

   
    
    const {data, error} = await serviceRoleClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: 'http://localhost:3000/dashboard/staff',
        data: {
            fullName: fullName,
            role: role,
            team: team,
            createdById: createdById,
        }
    })
    if (error) {
        console.error('Error inviting user:', error)
        return { message: 'Failed to invite user '}
    }
    console.log(data)
    await prisma.invites.create({
        data: {
            email: email,
            fullName: fullName,
            role: role,
            team: team,
            createdById: createdById,
        },
    })
    revalidatePath('/dashboard/staff', 'layout')
    return { message: 'Invite created successfully ' }
   } catch (error) {
    console.error('Error creating invite:', error)
    return { message: 'Failed to create invite' }
   }
}




export async function revokeAccess(id: string) {
   
    const user = await prisma.users.findUnique({
        where: {
            id: id,
        },
    })
    //console.log(user)
if (!user) {
    throw new Error('User not found')
   // return { message: 'User not found' }
}

const raw_user_meta_data = user?.raw_user_meta_data 
    await prisma.users.update({
        where: {
            id: id,
        },
        data: {
            raw_user_meta_data: {
                ...(typeof raw_user_meta_data === 'object' && raw_user_meta_data !== null ? raw_user_meta_data : {}),
                is_active: false,
               
            },
        },
    })
    //console.log('revoked access for user', id)
    revalidatePath(`/dashboard/staff/${id}`)
    revalidatePath('/dashboard/staff')

}

export async function grantAccess(id: string) {
    const user = await prisma.users.findUnique({
        where: {
            id: id,
        },
    })
    if (!user) {
        //return { message: 'User not found' }
        throw new Error('User not found')
    }
    const raw_user_meta_data = user?.raw_user_meta_data 
    await prisma.users.update({
        where: {
            id: id,
        },
        data: {
            raw_user_meta_data: {
                ...(typeof raw_user_meta_data === 'object' && raw_user_meta_data !== null ? raw_user_meta_data : {}),
                is_active: true,
                
            },
        },
    })
    
   
    
    revalidatePath(`/dashboard/staff/${id}`)
    
    revalidatePath('/dashboard/staff')
    console.log('done')
}


export async function deleteStaff(id: string) {
    try {
        await prisma.userProfiles.delete({
            where: {
                id: id,
            },
        })
    } catch (error) {
        console.error('Error deleting user:', error)
        throw new Error('Failed to delete user')
    }
    revalidatePath('/dashboard/staff')
    redirect('/dashboard/staff')
}



export async function revokeAccessForTimeFrame(id: string) {

    console.log(id)
    revalidatePath('/dashboard/staff', 'layout')
    
}



export async function banUserAction(prevState: {success: boolean, error: string, message: string}, formData: FormData) {
    const userId = formData.get("userId") as string
    const duration = formData.get("duration") as string
    const reason = formData.get("reason") as string
  
    // Validation
    if (!userId) {
      return {
        success: false,
        error: "Please select a user to ban",
        message: "Please try again"
      }
    }
  
    if (!duration) {
      return {
        success: false,
        error: "Please select a ban duration",
        message: "Please try again"
      }
    }
  
    // Find user data
    const user = await serviceRoleClient.auth.admin.getUserById(userId)
    const durationLabel = banDurations.find((d) => d.value === duration)?.label
  
    if (!user) {
      return {
        success: false,
        error: "User not found",
        message: "Please try again"
      }
    }
  
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await serviceRoleClient.auth.admin.updateUserById(userId, {
        ban_duration: duration,
     
       
    })  
    // Simulate random failure for demo purposes (10% chance)
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: "Failed to ban user. Please try again.",
        message: "Please try again"
      }
    }
  
    // Success response
    return {
      success: true,
      error: "",
      message: `${user.data?.user?.user_metadata?.fullName} has been banned for ${durationLabel?.toLowerCase()}${reason ? ` (Reason: ${reason})` : ""}`,
    }
  }


export async function banAccess(id: string,banDuration: string) {
   
    const user = await serviceRoleClient.auth.admin.getUserById(id)
    console.log(user)


    // const user = await prisma.users.findUnique({
    //     where: {
    //         id: id,
    //     },
    // })
    console.log(user)
if (!user) {
    throw new Error('User not found')
   // return { message: 'User not found' }
}
 
await serviceRoleClient.auth.admin.updateUserById(id, {
    ban_duration: banDuration
})

    console.log('revoked access for user', id)
    const user2 = await serviceRoleClient.auth.admin.getUserById(id)
    console.log(user2)
    revalidatePath(`/dashboard/staff/${id}`, 'layout')
    
}