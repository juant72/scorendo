import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MatchStatus } from '@prisma/client';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // ═══════════════════════════════════════
    // 1. COMPETITIONS (OPTION A - SAFE NAMES)
    // ═══════════════════════════════════════
    const compArg = await prisma.competition.upsert({
      where: { slug: 'argentine-football-first-div' },
      update: {},
      create: { 
        name: 'Argentine Football First Div', 
        slug: 'argentine-football-first-div',
        country: 'Argentina',
        category: 'Domestic League'
      }
    });

    const compUefa = await prisma.competition.upsert({
      where: { slug: 'european-champions-cup' },
      update: {},
      create: { 
        name: 'European Champions Cup', 
        slug: 'european-champions-cup',
        category: 'International Club'
      }
    });

    // ═══════════════════════════════════════
    // 2. TEAMS & VENUES
    // ═══════════════════════════════════════
    const teamsData = [
      { name: 'River', code: 'RIV', confederation: 'CONMEBOL' },
      { name: 'Boca', code: 'BOC', confederation: 'CONMEBOL' },
      { name: 'Racing', code: 'RAC', confederation: 'CONMEBOL' },
      { name: 'Independiente', code: 'IND', confederation: 'CONMEBOL' },
      { name: 'Madrid', code: 'RMA', confederation: 'UEFA' },
      { name: 'City', code: 'MCI', confederation: 'UEFA' },
      { name: 'Arsenal', code: 'ARS', confederation: 'UEFA' },
      { name: 'Bayern', code: 'BAY', confederation: 'UEFA' }
    ];

    for (const t of teamsData) {
      await prisma.team.upsert({
        where: { code: t.code }, update: {}, create: t
      });
    }

    // ═══════════════════════════════════════
    // 3. TOURNAMENTS
    // ═══════════════════════════════════════
    const tournamentArg = await prisma.tournament.upsert({
      where: { slug: 'lpf-2026' },
      update: { competitionId: compArg.id },
      create: {
        name: 'LPF 2026 - First Stage',
        slug: 'lpf-2026',
        competitionId: compArg.id,
        startDate: new Date('2026-01-20'),
        endDate: new Date('2026-12-15'),
        status: 'GROUP_STAGE'
      }
    });

    const tournamentChampions = await prisma.tournament.upsert({
      where: { slug: 'champions-25-26' },
      update: { competitionId: compUefa.id },
      create: {
        name: 'European Cup 25/26 - Final Phase',
        slug: 'champions-25-26',
        competitionId: compUefa.id,
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-05-31'),
        status: 'KNOCKOUT'
      }
    });

    // ═══════════════════════════════════════
    // 4. PHASES
    // ═══════════════════════════════════════
    const phaseArg = await prisma.phase.upsert({
      where: { tournamentId_slug: { tournamentId: tournamentArg.id, slug: 'matchday-14' } },
      update: {},
      create: {
        tournamentId: tournamentArg.id, name: 'Matchday 14', slug: 'matchday-14', order: 14,
        startDate: new Date('2026-04-01'), endDate: new Date('2026-04-05')
      }
    });

    const phaseUefa = await prisma.phase.upsert({
      where: { tournamentId_slug: { tournamentId: tournamentChampions.id, slug: 'quarter-finals' } },
      update: {},
      create: {
        tournamentId: tournamentChampions.id, name: 'Quarter Finals', slug: 'quarter-finals', order: 1,
        startDate: new Date('2026-04-01'), endDate: new Date('2026-04-15')
      }
    });

    // ═══════════════════════════════════════
    // 5. MATCHES (REAL FEEL FOR APRIL 2026)
    // ═══════════════════════════════════════
    const riv = await prisma.team.findUnique({ where: { code: 'RIV' } });
    const boc = await prisma.team.findUnique({ where: { code: 'BOC' } });
    const rac = await prisma.team.findUnique({ where: { code: 'RAC' } });
    const ind = await prisma.team.findUnique({ where: { code: 'IND' } });

    const rma = await prisma.team.findUnique({ where: { code: 'RMA' } });
    const mci = await prisma.team.findUnique({ where: { code: 'MCI' } });

    // AFA Matches
    const afaMatch1 = await prisma.match.upsert({
      where: { id: 'afa-md14-1' }, update: { kickoff: new Date('2026-04-05T21:00:00Z') },
      create: { id: 'afa-md14-1', phaseId: phaseArg.id, matchNumber: 1, homeTeamId: riv!.id, awayTeamId: rac!.id, kickoff: new Date('2026-04-05T21:00:00Z') }
    });

    const afaMatch2 = await prisma.match.upsert({
      where: { id: 'afa-md14-2' }, update: { kickoff: new Date('2026-04-06T00:00:00Z') },
      create: { id: 'afa-md14-2', phaseId: phaseArg.id, matchNumber: 2, homeTeamId: boc!.id, awayTeamId: ind!.id, kickoff: new Date('2026-04-06T00:00:00Z') }
    });

    // UEFA Matches
    const uefaMatch1 = await prisma.match.upsert({
      where: { id: 'uefa-qf-1' }, update: { kickoff: new Date('2026-04-09T19:45:00Z') },
      create: { id: 'uefa-qf-1', phaseId: phaseUefa.id, matchNumber: 1, homeTeamId: rma!.id, awayTeamId: mci!.id, kickoff: new Date('2026-04-09T19:45:00Z') }
    });

    // ═══════════════════════════════════════
    // 6. CONTESTS (ROOKIES vs PROS)
    // ═══════════════════════════════════════
    
    // ARGENTINA - SEASON LONG
    await prisma.contest.upsert({
      where: { slug: 'lpf-2026-season-rookie' },
      update: { tournamentId: tournamentArg.id },
      create: {
        name: 'LPF Season - Rookie Arena',
        slug: 'lpf-2026-season-rookie',
        description: 'Predict all matchdays. Free entry, bragging rights and badges.',
        type: 'GRAND_TOURNAMENT', tier: 'FREE', entryFeeSOL: 0, prizePool: BigInt(0), distribution: { "1": 1.0 },
        tournamentId: tournamentArg.id, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), registrationEnd: new Date('2026-12-31'), status: 'ACTIVE'
      }
    });

    await prisma.contest.upsert({
      where: { slug: 'lpf-2026-season-pro' },
      update: { tournamentId: tournamentArg.id },
      create: {
        name: 'LPF Season - Pro Glory',
        slug: 'lpf-2026-season-pro',
        description: 'The ultimate survival course. 1 SOL entry for the massive season pot.',
        type: 'GRAND_TOURNAMENT', tier: 'PREMIUM', entryFeeSOL: 1.0, prizePool: BigInt(100000000000), distribution: { "1": 0.5, "2": 0.3, "3": 0.2 },
        tournamentId: tournamentArg.id, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), registrationEnd: new Date('2026-12-31'), status: 'ACTIVE'
      }
    });

    // ARGENTINA - MATCHDAY 14
    await prisma.contest.upsert({
      where: { slug: 'afa-md14-rookie' },
      update: { phaseId: phaseArg.id },
      create: {
        name: 'Matchday 14 - Rookie Box',
        slug: 'afa-md14-rookie',
        description: 'Quick weekend fun. No entry fee.',
        type: 'PHASE', tier: 'FREE', entryFeeSOL: 0, prizePool: BigInt(0), distribution: { "1": 1.0 },
        tournamentId: tournamentArg.id, phaseId: phaseArg.id, startDate: new Date('2026-04-01'), endDate: new Date('2026-04-10'), registrationEnd: new Date('2026-04-05'), status: 'ACTIVE'
      }
    });

    await prisma.contest.upsert({
      where: { slug: 'afa-md14-pro' },
      update: { phaseId: phaseArg.id },
      create: {
        name: 'Matchday 14 - Pro Battle',
        slug: 'afa-md14-pro',
        description: '0.1 SOL entry for the matchday pool.',
        type: 'PHASE', tier: 'STANDARD', entryFeeSOL: 0.1, prizePool: BigInt(10000000000), distribution: { "1": 0.7, "2": 0.3 },
        tournamentId: tournamentArg.id, phaseId: phaseArg.id, startDate: new Date('2026-04-01'), endDate: new Date('2026-04-10'), registrationEnd: new Date('2026-04-05'), status: 'ACTIVE'
      }
    });

    // UEFA - MATCHDAY (QUARTERS)
    await prisma.contest.upsert({
      where: { slug: 'uefa-qf-pro' },
      update: { phaseId: phaseUefa.id },
      create: {
        name: 'UEFA Quarters - Pro Midweek',
        slug: 'uefa-qf-pro',
        description: 'The path to Paris. Predict the first legs.',
        type: 'PHASE', tier: 'PREMIUM', entryFeeSOL: 0.5, prizePool: BigInt(50000000000), distribution: { "1": 1.0 },
        tournamentId: tournamentChampions.id, phaseId: phaseUefa.id, startDate: new Date('2026-04-01'), endDate: new Date('2026-04-15'), registrationEnd: new Date('2026-04-09'), status: 'UPCOMING'
      }
    });

    // ═══════════════════════════════════════
    // 7. GRANT ADMIN PRIVILEGES (DEV ONLY)
    // ═══════════════════════════════════════
    await prisma.user.updateMany({
      data: { isAdmin: true }
    });

    return NextResponse.json({ success: true, message: 'Seeded Multi-Tier League Hierarchy & Granted Admin access successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
