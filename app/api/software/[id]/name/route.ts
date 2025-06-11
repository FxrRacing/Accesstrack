import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const software = await prisma.software.findUnique({ where: { id }, select: { name: true } });
  if (!software) {
    return NextResponse.json({ name: null }, { status: 404 });
  }
  return NextResponse.json({ name: software.name });
} 