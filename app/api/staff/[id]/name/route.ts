import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const user = await prisma.user.findUnique({ where: { id }, select: { name: true } });
  if (!user) {
    return NextResponse.json({ name: null }, { status: 404 });
  }
  return NextResponse.json({ name: user.name });
} 