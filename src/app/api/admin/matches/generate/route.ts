import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { leagueSlug, matchdayNumber } = await req.json();

    const competition = await prisma.competition.findUnique({
      where: { slug: leagueSlug },
      include: { tournaments: true }
    });

    if (!competition || competition.tournaments.length === 0) {
      return NextResponse.json({ success: false, error: 'League/Tournament not found' }, { status: 404 });
    }

    const tournament = competition.tournaments[0];
    const matchdayName = `Matchday ${matchdayNumber}`;

    // 1. Create Phase
    const phase = await prisma.phase.create({
      data: {
        name: matchdayName,
        tournamentId: tournament.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
      }
    });

    // 2. Create Free Contest
    await prisma.contest.create({
      data: {
        name: `${competition.name} - ${matchdayName} (FREE)`,
        slug: `${leagueSlug}-fecha-${matchdayNumber}-free-${Math.random().toString(36).substring(7)}`,
        tournamentId: tournament.id,
        phaseId: phase.id,
        entryFeeSOL: 0,
        prizePool: 0,
        status: 'UPCOMING',
        tier: 'AMATEUR'
      }
    });

    // 3. Create PRO Contest
    await prisma.contest.create({
      data: {
        name: `${competition.name} - ${matchdayName} (PRO)`,
        slug: `${leagueSlug}-fecha-${matchdayNumber}-pro-${Math.random().toString(36).substring(7)}`,
        tournamentId: tournament.id,
        phaseId: phase.id,
        entryFeeSOL: 0.1, // Default 0.1 SOL for pro
        prizePool: 0,
        status: 'UPCOMING',
        tier: 'PRO'
      }
    });

    return NextResponse.json({ success: true, phaseId: phase.id });
  } catch (error) {
    console.error('GENERATE_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 });
  }
}
