'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function deleteSharedAccount(prevState: {message: string}, formData: FormData) {
    'use server'
    const id = formData.get('id') as string;
    try {
        const existingSharedAccount = await prisma.sharedAccount.findUnique({where: {id}})
        if (!existingSharedAccount) {
            return {message: 'Shared account not found.'}
        }
        console.log('deleting', existingSharedAccount);
       await prisma.sharedAccount.delete({where: {id}})
        //await prisma.sharedAccount.delete({where: {id}})
    } catch (error) {
        console.error('Error deleting shared account:', error);
        return {message: 'Failed to delete shared account.'}
    }
    revalidatePath('/dashboard/shared-accounts')
   
    redirect('/dashboard/shared-accounts')
}