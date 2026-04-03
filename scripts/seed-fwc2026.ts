import { PrismaClient, ContestType, ContestTier, ContestStatus, TournamentStatus, MatchStatus, VenueZone } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⚽ Initializing FIFA World Cup 2026 Arena...');

  // 1. Create or Update Competition
  const competition = await prisma.competition.upsert({
    where: { slug: 'fifa-world-cup-2026' },
    update: {
      category: 'International National',
      country: 'USA/Mexico/Canada',
      logoUrl: '/logos/fwc2026.png'
    },
    create: {
      name: 'FIFA World Cup 2026',
      slug: 'fifa-world-cup-2026',
      category: 'International National',
      country: 'USA/Mexico/Canada',
      logoUrl: '/logos/fwc2026.png'
    }
  });

  // 2. Update existing Tournament or Create if missing
  const tournament = await prisma.tournament.upsert({
    where: { slug: 'fifa-world-cup-2026' },
    update: {
      competitionId: competition.id,
      status: TournamentStatus.UPCOMING
    },
    create: {
      name: 'FIFA World Cup 2026™',
      slug: 'fifa-world-cup-2026',
      startDate: new Date('2026-06-11'),
      endDate: new Date('2026-07-19'),
      status: TournamentStatus.UPCOMING,
      competitionId: competition.id
    }
  });

  // 3. Ensure Phases are present
  const phases = [
    { name: 'Group Stage', slug: 'group-stage', order: 1, start: '2026-06-11', end: '2026-06-27', mult: 1.0 },
    { name: 'Round of 32', slug: 'round-of-32', order: 2, start: '2026-06-28', end: '2026-07-03', mult: 1.25 },
    { name: 'Round of 16', slug: 'round-of-16', order: 3, start: '2026-07-04', end: '2026-07-07', mult: 1.5 },
    { name: 'Quarter-finals', slug: 'quarter-finals', order: 4, start: '2026-07-09', end: '2026-07-11', mult: 2.0 },
    { name: 'Semi-finals', slug: 'semi-finals', order: 5, start: '2026-07-14', end: '2026-07-15', mult: 2.5 },
    { name: 'Final', slug: 'final', order: 7, start: '2026-07-19', end: '2026-07-19', mult: 3.0 }
  ];

  for (const p of phases) {
    await prisma.phase.upsert({
      where: { tournamentId_slug: { tournamentId: tournament.id, slug: p.slug } },
      update: { multiplier: p.mult },
      create: {
        tournamentId: tournament.id,
        name: p.name,
        slug: p.slug,
        order: p.order,
        startDate: new Date(p.start),
        endDate: new Date(p.end),
        multiplier: p.mult
      }
    });
  }

  const groupStage = await prisma.phase.findFirst({ where: { slug: 'group-stage', tournamentId: tournament.id } });
  const finalPhase = await prisma.phase.findFirst({ where: { slug: 'final', tournamentId: tournament.id } });

  // 4. Create World Cup Contests
  const contestsToCreate = [
    // 🌍 GENERAL (GRAND TOURNAMENT)
    {
      name: 'FIFA World Cup 2026: Global Ultimate',
      slug: 'fwc2026-global-ultimate',
      description: 'The master leaderboard for the entire World Cup. Every prediction counts.',
      type: ContestType.GRAND_TOURNAMENT,
      tier: ContestTier.FREE,
      entrySOL: 0,
      prizePool: BigInt(100000000000), // 100 SOL (Simulated)
      tournamentId: tournament.id,
      startDate: new Date('2026-06-11T20:00:00Z'),
      endDate: new Date('2026-07-19T23:59:59Z'),
      status: ContestStatus.REGISTRATION
    },
    // 📅 DAILY (MATCH DAY)
    {
      name: 'Day 01: The Grand Opening',
      slug: 'fwc2026-day-01-opening',
      description: 'Opening matches battle. Fast action, high stakes.',
      type: ContestType.MATCH_DAY,
      tier: ContestTier.STANDARD,
      entrySOL: 0.1,
      prizePool: BigInt(10000000000), // 10 SOL 
      phaseId: groupStage?.id,
      startDate: new Date('2026-06-11T20:00:00Z'),
      endDate: new Date('2026-06-11T23:59:59Z'),
      status: ContestStatus.UPCOMING
    },
    // 🛡️ GROUP BATTLE (GROUP C)
    {
      name: 'Group C Battle: tactical Ops',
      slug: 'fwc2026-group-c-ops',
      description: 'Focus solely on Group C matches. Dominate the zone.',
      type: ContestType.GROUP_BATTLE,
      tier: ContestTier.MICRO,
      entrySOL: 0.05,
      prizePool: BigInt(5000000000), // 5 SOL
      phaseId: groupStage?.id,
      startDate: new Date('2026-06-13T15:00:00Z'),
      endDate: new Date('2026-06-25T23:59:59Z'),
      status: ContestStatus.UPCOMING
    },
    // 🔥 FINAL PHASE (PHASE)
    {
      name: 'The Final Stand: Champions Path',
      slug: 'fwc2026-final-stand',
      description: 'Only for the elite. Predictions for the final match.',
      type: ContestType.PHASE,
      tier: ContestTier.PREMIUM,
      entrySOL: 0.5,
      prizePool: BigInt(25000000000), // 25 SOL
      phaseId: finalPhase?.id,
      startDate: new Date('2026-07-19T00:00:00Z'),
      endDate: new Date('2026-07-19T23:59:59Z'),
      status: ContestStatus.UPCOMING
    }
  ];

  for (const c of contestsToCreate) {
    await prisma.contest.upsert({
      where: { slug: c.slug },
      update: {
         status: c.status,
         type: c.type,
         tier: c.tier,
         entryFeeSOL: c.entrySOL,
         entryFeeLamports: BigInt(c.entrySOL * 10**9),
         prizePool: c.prizePool,
         tournamentId: c.tournamentId,
         phaseId: c.phaseId
      },
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        type: c.type,
        tier: c.tier,
        entryFeeSOL: c.entrySOL,
        entryFeeLamports: BigInt(c.entrySOL * 10**9),
        prizePool: c.prizePool,
        distribution: { "1": 0.5, "2": 0.3, "3": 0.2 },
        tournamentId: c.tournamentId,
        phaseId: c.phaseId,
        startDate: c.startDate,
        endDate: c.endDate,
        registrationEnd: c.startDate,
        status: c.status,
        minParticipants: 2,
        currentEntries: 0
      }
    });
  }

  console.log('✅ FIFA World Cup 2026 Seeding Complete!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
