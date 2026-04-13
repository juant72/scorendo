import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
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
