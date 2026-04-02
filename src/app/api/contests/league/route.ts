import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const competitions = await prisma.competition.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true }
    });
    return NextResponse.json({ success: true, competitions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
