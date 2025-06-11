import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const location = await prisma.location.findUnique({ where: { id }, select: { name: true } });
  if (!location) {
    return NextResponse.json({ name: null }, { status: 404 });
  }
  return NextResponse.json({ name: location.name });
} 