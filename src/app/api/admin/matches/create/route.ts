import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    
    if (!session?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    const body = await req.json();
    const { 
      phaseId,
      homeTeamId, 
      awayTeamId, 
      startTime,
    } = body;

    if (!phaseId || !homeTeamId || !awayTeamId || !startTime) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: phaseId, homeTeamId, awayTeamId, startTime' 
      }, { status: 400 });
    }

    if (homeTeamId === awayTeamId) {
      return NextResponse.json({ 
        success: false, 
        error: 'A team cannot play against itself' 
      }, { status: 400 });
    }

    // Get current highest matchNumber in this phase
    const lastMatch = await prisma.match.findFirst({
      where: { phaseId },
      orderBy: { matchNumber: 'desc' },
      select: { matchNumber: true }
    });
    const matchNumber = (lastMatch?.matchNumber ?? 0) + 1;

    const match = await prisma.match.create({
      data: {
        phaseId,
        matchNumber,
        homeTeamId,
        awayTeamId,
        kickoff: new Date(startTime),
        status: 'SCHEDULED',
      },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    });

    return NextResponse.json({ success: true, match });

  } catch (error: any) {
    console.error('Match Creation Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to create match' 
    }, { status: 500 });
  }
}
