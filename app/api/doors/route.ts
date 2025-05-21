import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')

    if (!locationId) {
        return NextResponse.json([])
    }

    const doors = await prisma.door.findMany({
        where: { locationId }
    })
    return NextResponse.json(doors)
}
