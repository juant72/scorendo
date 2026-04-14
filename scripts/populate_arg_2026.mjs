import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- SCORENDO ARGENTINA 2026 POPULATION (V2) ---');

  // 1. Sport
  const football = await prisma.sport.upsert({
    where: { slug: 'football' },
    update: {},
    create: { name: 'Football', slug: 'football', type: 'TEAM_VS_TEAM' }
  });

  // 2. Competitions
  const copaArgComp = await prisma.competition.upsert({
    where: { slug: 'copa-argentina' },
    update: { sportId: football.id },
    create: {
      name: 'Copa Argentina',
      slug: 'copa-argentina',
      category: 'Elite Knockout',
      country: 'Argentina',
      sportId: football.id
    }
  });

  const lpfComp = await prisma.competition.upsert({
    where: { slug: 'argentine-football-first-div' },
    update: { sportId: football.id },
    create: {
       name: 'Argentine Football First Div',
       slug: 'argentine-football-first-div',
       category: 'Professional League',
       country: 'Argentina',
       sportId: football.id
    }
  });

  // 3. Tournaments
  const copaArg2026 = await prisma.tournament.upsert({
    where: { slug: 'copa-argentina-2026' },
    update: {},
    create: {
      name: 'Copa Argentina 2026',
      slug: 'copa-argentina-2026',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-11-30'),
      competitionId: copaArgComp.id,
      status: 'UPCOMING'
    }
  });

  const lpf2026 = await prisma.tournament.upsert({
    where: { slug: 'lpf-2026-season' },
    update: {},
    create: {
      name: 'Torneo LPF 2026',
      slug: 'lpf-2026-season',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-12-15'),
      competitionId: lpfComp.id,
      status: 'UPCOMING'
    }
  });

  // 4. Create "Full Season" Arenas (League and Copa)
  const fullSeasonTiers = [
    { tier: 'FREE', sol: 0, name: 'Season Rookie' },
    { tier: 'STANDARD', sol: 0.1, name: 'Standard Campaign' },
    { tier: 'PREMIUM', sol: 1.0, name: 'Legendary Campaign' }
  ];

  for (const t of fullSeasonTiers) {
     await prisma.contest.upsert({
       where: { slug: `${lpf2026.slug}-${t.tier.toLowerCase()}` },
       update: {},
       create: {
         name: `${lpf2026.name}: ${t.name}`,
         slug: `${lpf2026.slug}-${t.tier.toLowerCase()}`,
         tournamentId: lpf2026.id,
         type: 'GRAND_TOURNAMENT',
         tier: t.tier,
         entryFeeSOL: t.sol,
         distribution: { winner: 70, runnerUp: 20, third: 10 },
         startDate: lpf2026.startDate,
         endDate: lpf2026.endDate,
         registrationEnd: new Date(lpf2026.startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
       }
     });
  }

  // 5. Teams
  const teams = await prisma.team.findMany({
    where: { code: { in: ['RIV', 'BOC', 'RAC', 'IND', 'SLO', 'TAL', 'EST', 'VEL'] } }
  });
  const getTeam = (code) => teams.find(t => t.code === code);

  // 6. Phases & Phase-specific Arenas
  const fechas = [
    { name: 'Fecha 1', slug: 'fecha-1', start: '2026-05-12' },
    { name: 'Fecha 2', slug: 'fecha-2', start: '2026-05-19' },
    { name: 'Fecha 3', slug: 'fecha-3', start: '2026-05-26' },
  ];

  for (let i = 0; i < fechas.length; i++) {
    const f = fechas[i];
    const phase = await prisma.phase.upsert({
      where: { tournamentId_slug: { tournamentId: lpf2026.id, slug: f.slug } },
      update: {},
      create: {
        tournamentId: lpf2026.id,
        name: f.name,
        slug: f.slug,
        order: i + 1,
        startDate: new Date(f.start),
        endDate: new Date(new Date(f.start).getTime() + 5 * 24 * 60 * 60 * 1000)
      }
    });

    // Create Arena for this Fecha
    await prisma.contest.upsert({
       where: { slug: `${lpf2026.slug}-${f.slug}-battle` },
       update: { phaseId: phase.id },
       create: {
         name: `${f.name}: Tactical Battle`,
         slug: `${lpf2026.slug}-${f.slug}-battle`,
         tournamentId: lpf2026.id,
         phaseId: phase.id,
         type: 'PHASE',
         tier: 'STANDARD',
         entryFeeSOL: 0.1,
         distribution: { winner: 100 },
         startDate: phase.startDate,
         endDate: phase.endDate,
         registrationEnd: phase.startDate
       }
    });

    // Match if not exists
    const existingMatches = await prisma.match.findMany({ where: { phaseId: phase.id } });
    if (existingMatches.length === 0) {
      const home = teams[i % teams.length];
      const away = teams[(i + 1) % teams.length];
      await prisma.match.create({
        data: {
          phaseId: phase.id,
          matchNumber: 1,
          homeTeamId: home.id,
          awayTeamId: away.id,
          kickoff: new Date(`${f.start}T20:00:00Z`),
          status: 'SCHEDULED'
        }
      });
    }
  }

  console.log('--- DATABASE SYNC COMPLETE ---');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
