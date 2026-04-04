import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      tournamentId, 
      phaseId, 
      homeTeamId, 
      awayTeamId, 
      startTime, 
      stadium,
      metadata
    } = body;

    // 1. Basic Validation
    if (!tournamentId || !homeTeamId || !awayTeamId || !startTime) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // 2. Prevent Same Team Match
    if (homeTeamId === awayTeamId) {
      return NextResponse.json({ 
        success: false, 
        error: 'A team cannot play against itself' 
      }, { status: 400 });
    }

    // 3. Create the Match
    const match = await prisma.match.create({
      data: {
        tournamentId,
        phaseId: phaseId || null,
        homeTeamId,
        awayTeamId,
        startTime: new Date(startTime),
        stadium: stadium || 'TBD',
        status: 'SCHEDULED',
        metadata: metadata || {}
      },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    });

    return NextResponse.json({
      success: true,
      match
    });

  } catch (error: any) {
    console.error('Match Creation Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to create match' 
    }, { status: 500 });
  }
}
