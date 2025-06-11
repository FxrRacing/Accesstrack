import { prisma } from '@/lib/prisma';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
 
  const user = await prisma.userProfiles.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) {
    return NextResponse.json({ name: null }, { status: 404 });
  }
  console.log(user.fullName)
  return NextResponse.json({ name: user.fullName });
} 