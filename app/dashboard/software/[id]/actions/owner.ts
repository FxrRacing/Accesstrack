'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function assignOwner(prevState: {message: string, success: boolean}, formData: FormData) {
    const softwareId = formData.get("softwareId") as string
    const userId = formData.get("userId") as string
    const authId = formData.get("authId") as string
    if (!softwareId || !userId || !authId) {
        return { message: "Missing required fields", success: false }
    }
    // softwareId: string, userId: string, authId: string
    const software = await prisma.software.findUnique({
        where: { id: softwareId },
        include: { teamOwner: true }
    })
    if (!software) {
        return { message: "Software not found", success: false }
    }
    if (software.teamOwnerId === userId) {
        return { message: "User is already the owner", success: false }
    }
    await prisma.software.update({
        where: { id: softwareId },
        data: { teamOwnerId: userId }
    })
    // Add to history
    const newOwner = await prisma.userProfiles.findUnique({ where: { id: userId } });
    await prisma.softwareHistory.create({
      data: {
        softwareId,
        action: "assigned",
        field: "teamOwner",
        oldValue: software.teamOwner?.fullName ?? null,
        newValue: newOwner?.fullName ?? null,
        updatedById: authId,
      }
    });
    revalidatePath(`/dashboard/software/${softwareId}`)
    return { message: "Owner updated", success: true }
}


export async function removeOwner(prevState: {message: string, success: boolean}, formData: FormData) {
    const softwareId = formData.get("softwareId") as string
    const authId = formData.get("authId") as string
    if (!softwareId || !authId) {
        return { message: "Missing required fields", success: false }
    }
    const software = await prisma.software.findUnique({
        where: { id: softwareId },
        include: { teamOwner: true }
    })
    if (!software) {
        return { message: "Software not found", success: false }
    }
    
    await prisma.software.update({
        where: { id: softwareId },
        data: { teamOwnerId: null }
    })
    // Add to history
    await prisma.softwareHistory.create({
      data: {
        softwareId,
        action: "removed",
        field: "teamOwner",
        oldValue: software.teamOwner?.fullName ?? null,
        newValue: null,
        updatedById: authId,
      }
    });
    revalidatePath(`/dashboard/software/${softwareId}`)
    return { message: "Owner removed", success: true }
}