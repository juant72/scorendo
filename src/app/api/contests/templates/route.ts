import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

/**
 * GET /api/contests/templates
 * Returns active, public contests that are eligible for cloning into private leagues.
 * Rule: Matchday must start in > 1 hour.
 */
export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const templates = await prisma.contest.findMany({
      where: {
        isPrivate: false,
        status: { in: ['UPCOMING', 'REGISTRATION', 'ACTIVE'] },
        startDate: { gt: oneHourFromNow } // Must have at least 1 hour safety buffer
      },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        startDate: true,
        description: true
      },
      orderBy: { startDate: 'asc' }
    });

    return NextResponse.json({ success: true, templates });
  } catch (error) {
    console.error('Fetch Templates Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
