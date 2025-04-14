'use server'

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';


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