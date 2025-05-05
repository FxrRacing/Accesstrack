'use server'

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import {  serviceRoleClient } from '@/utils/supabase/admin';
import { redirect } from 'next/navigation';





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
    console.log(user)
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
    console.log('revoked access for user', id)
    revalidatePath('/dashboard/staff', 'layout')
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
                role:"test"
            },
        },
    })
    
    const user2 = await prisma.users.findUnique({
        where: {
            id: id,
        },
    })
    console.log(user2)
    
    revalidatePath('/dashboard/staff', 'layout')
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
    revalidatePath('/dashboard/staff', 'layout')
    redirect('/dashboard/staff')
}