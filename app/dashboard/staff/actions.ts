'use server'

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';



export async function createInvite(prevState: {message: string}, formData: FormData) {
    const supabase = await createClient()
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
    const {data, error} = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: 'http://localhost:3000/dashboard/staff',
        data: {
            fullName: fullName,
            role: role,
            team: team,
            createdById: createdById,
        }
    })
    if (error) {
        return { message: 'Failed to invite user' }
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
    return { message: 'Invite created successfully' }
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

    await prisma.users.update({
        where: {
            id: id,
        },
        data: {
            raw_user_meta_data: {
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

    console.log(user)
    await prisma.users.update({
        where: {
            id: id,
        },
        data: {
            raw_user_meta_data: {
                is_active: true,
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