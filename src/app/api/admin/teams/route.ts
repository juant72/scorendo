import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        code: true,
        flagUrl: true
      }
    });

    return NextResponse.json({
      success: true,
      teams
    });

  } catch (error: any) {
    console.error('Fetch Teams Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch teams' 
    }, { status: 500 });
  }
}
