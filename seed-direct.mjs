import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  const VENUES = [
    { name: 'MetLife Stadium', city: 'New York', country: 'USA', zone: 'USA_EAST', capacity: 82500 },
    { name: 'Azteca Stadium', city: 'Mexico City', country: 'Mexico', zone: 'MEXICO', capacity: 83264 },
    { name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', zone: 'USA_WEST', capacity: 70240 },
    { name: 'BMO Field', city: 'Toronto', country: 'Canada', zone: 'CANADA', capacity: 30000 }
  ];

  const TEAMS = [
    { name: 'Argentina', code: 'ARG', confederation: 'CONMEBOL' },
    { name: 'Brazil', code: 'BRA', confederation: 'CONMEBOL' },
    { name: 'United States', code: 'USA', confederation: 'CONCACAF' }, 
    { name: 'Mexico', code: 'MEX', confederation: 'CONCACAF' }, 
    { name: 'Canada', code: 'CAN', confederation: 'CONCACAF' }, 
    { name: 'England', code: 'ENG', confederation: 'UEFA' }
  ];

  const PHASES = [
    { name: 'Group Stage', slug: 'group-stage', order: 1, startDate: new Date('2026-06-11'), endDate: new Date('2026-06-27'), multiplier: 1.0 },
  ];

  for (const v of VENUES) {
    await prisma.venue.upsert({
      where: { id: v.name.replace(/\s+/g, '-').toLowerCase() },
      update: {},
      create: { name: v.name, city: v.city, country: v.country, zone: v.zone, capacity: v.capacity }
    });
  }

  for (const t of TEAMS) {
    await prisma.team.upsert({
      where: { code: t.code },
      update: {},
      create: { name: t.name, code: t.code, confederation: t.confederation }
    });
  }

  const tournament = await prisma.tournament.upsert({
    where: { slug: 'fifa-world-cup-2026' },
    update: {},
    create: { name: 'FIFA World Cup 2026™', slug: 'fifa-world-cup-2026', startDate: new Date('2026-06-11'), endDate: new Date('2026-07-19'), status: 'UPCOMING' }
  });

  for (const p of PHASES) {
    await prisma.phase.upsert({
      where: { tournamentId_slug: { tournamentId: tournament.id, slug: p.slug } },
      update: {},
      create: { tournamentId: tournament.id, name: p.name, slug: p.slug, order: p.order, startDate: p.startDate, endDate: p.endDate, multiplier: p.multiplier }
    });
  }

  const groupPhase = await prisma.phase.findFirst({ where: { slug: 'group-stage' } });
  
  const azteca = await prisma.venue.findFirst({ where: { name: 'Azteca Stadium' } })
  const sofi = await prisma.venue.findFirst({ where: { name: 'SoFi Stadium' } })
  const bmo = await prisma.venue.findFirst({ where: { name: 'BMO Field' } })

  const mex = await prisma.team.findUnique({ where: { code: 'MEX' } })
  const usa = await prisma.team.findUnique({ where: { code: 'USA' } })
  const can = await prisma.team.findUnique({ where: { code: 'CAN' } })
  const arg = await prisma.team.findUnique({ where: { code: 'ARG' } })
  const bra = await prisma.team.findUnique({ where: { code: 'BRA' } })
  const eng = await prisma.team.findUnique({ where: { code: 'ENG' } })

  if (groupPhase && azteca && sofi && bmo && mex && usa && can && arg && bra && eng) {
    await prisma.match.upsert({
      where: { id: 'match-1' }, update: {},
      create: { id: 'match-1', phaseId: groupPhase.id, matchNumber: 1, homeTeamId: mex.id, awayTeamId: eng.id, venueId: azteca.id, kickoff: new Date('2026-06-11T20:00:00Z'), status: 'SCHEDULED' }
    });
    await prisma.match.upsert({
      where: { id: 'match-2' }, update: {},
      create: { id: 'match-2', phaseId: groupPhase.id, matchNumber: 2, homeTeamId: usa.id, awayTeamId: arg.id, venueId: sofi.id, kickoff: new Date('2026-06-12T20:00:00Z'), status: 'SCHEDULED' }
    });
    await prisma.match.upsert({
      where: { id: 'match-3' }, update: {},
      create: { id: 'match-3', phaseId: groupPhase.id, matchNumber: 3, homeTeamId: can.id, awayTeamId: bra.id, venueId: bmo.id, kickoff: new Date('2026-06-12T23:00:00Z'), status: 'SCHEDULED' }
    });
  }

  await prisma.contest.upsert({
    where: { slug: 'world-cup-2026-global' },
    update: {},
    create: {
      name: 'Global World Cup Prediction Pool', slug: 'world-cup-2026-global',
      description: 'Predict all matches throughout the tournament and win the Grand Prize. Entry is free!',
      type: 'GRAND_TOURNAMENT', tier: 'FREE', entryFeeLamports: 0n, entryFeeSOL: 0,
      prizePool: 50000000000n, distribution: { "1": 0.5, "2": 0.3, "3": 0.2 },
      tournamentId: tournament.id,
      startDate: new Date('2026-06-11T20:00:00Z'), endDate: new Date('2026-07-19T23:59:59Z'), registrationEnd: new Date('2026-06-11T20:00:00Z'),
      status: 'UPCOMING', minParticipants: 10, maxParticipants: 1000000, currentEntries: 12543
    }
  });

  await prisma.contest.upsert({
    where: { slug: 'opening-weekend-battle' },
    update: {},
    create: {
      name: 'Opening Weekend High-Roller', slug: 'opening-weekend-battle',
      description: 'Predict the first 3 opening matches correctly. Winner takes all.',
      type: 'MATCH_DAY', tier: 'PREMIUM', entryFeeLamports: 1000000000n, entryFeeSOL: 1,
      prizePool: 15000000000n, distribution: { "1": 1.0 },
      phaseId: groupPhase?.id,
      startDate: new Date('2026-06-11T20:00:00Z'), endDate: new Date('2026-06-13T23:59:59Z'), registrationEnd: new Date('2026-06-11T20:00:00Z'),
      status: 'UPCOMING', minParticipants: 2, maxParticipants: 100, currentEntries: 14
    }
  });

  console.log('Seed completed.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
