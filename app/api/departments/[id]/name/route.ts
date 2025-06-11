import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = (await context.params);
  const department = await prisma.department.findUnique({ where: { id }, select: { name: true } });
  if (!department) {
    return NextResponse.json({ name: null }, { status: 404 });
  }
  return NextResponse.json({ name: department.name });
} 