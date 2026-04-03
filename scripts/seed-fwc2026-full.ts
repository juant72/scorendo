import { PrismaClient, MatchStatus } from '@prisma/client';

const prisma = new PrismaClient();

const GROUPS = {
  'Group A': ['MEX', 'RSA', 'KOR', 'CZE'],
  'Group B': ['CAN', 'SUI', 'QAT', 'BIH'],
  'Group C': ['BRA', 'MAR', 'HAI', 'SCO'],
  'Group D': ['USA', 'PAR', 'AUS', 'TUR'],
  'Group E': ['GER', 'ECU', 'CIV', 'CUR'],
  'Group F': ['NED', 'JPN', 'TUN', 'SWE'],
  'Group G': ['BEL', 'IRN', 'EGY', 'NZL'],
  'Group H': ['ESP', 'URU', 'KSA', 'CPV'],
  'Group I': ['FRA', 'SEN', 'NOR', 'IRQ'],
  'Group J': ['ARG', 'ALG', 'AUT', 'JOR'],
  'Group K': ['POR', 'COL', 'UZB', 'COD'],
  'Group L': ['ENG', 'CRO', 'GHA', 'PAN']
};

async function main() {
  console.log('🚀 Regenerating Scorendo Elite FWC 2026 Season (Group Stage + Real Data)...');

  const tournament = await prisma.tournament.findUnique({
    where: { slug: 'fifa-world-cup-2026' }
  });

  if (!tournament) return;

  const phases = await prisma.phase.findMany({ where: { tournamentId: tournament.id } });
  const groupPhase = phases.find(p => p.slug === 'group-stage');

  if (!groupPhase) return;

  const phaseIds = phases.map(p => p.id);

  // 1. Full Reset of current tournament matches/teams groups
  console.log('Cleaning up existing tournament state...');
  const matchIds = (await prisma.match.findMany({ where: { phaseId: { in: phaseIds } }, select: { id: true } })).map(m => m.id);
  
  await prisma.prediction.deleteMany({ where: { matchId: { in: matchIds } } });
  await prisma.match.deleteMany({ where: { id: { in: matchIds } } });
  
  // Clear group assignments for all teams in this tournament
  await prisma.tournamentTeam.updateMany({
      where: { tournamentId: tournament.id },
      data: { groupId: null }
  });

  const venues = await prisma.venue.findMany();
  let totalMatchesCreated = 0;

  // 2. Assign teams to real groups and generate fixtures
  for (const [groupName, teamCodes] of Object.entries(GROUPS)) {
    const group = await prisma.group.upsert({
      where: { phaseId_name: { phaseId: groupPhase.id, name: groupName } },
      update: {},
      create: { phaseId: groupPhase.id, name: groupName }
    });

    console.log(`Setting up ${groupName}...`);

    for (const code of teamCodes) {
      const team = await prisma.team.findUnique({ where: { code } });
      if (team) {
        await prisma.tournamentTeam.upsert({
          where: { teamId_tournamentId: { teamId: team.id, tournamentId: tournament.id } },
          update: { groupId: group.id },
          create: { teamId: team.id, tournamentId: tournament.id, groupId: group.id }
        });
      }
    }

    const tTeams = await prisma.tournamentTeam.findMany({
      where: { tournamentId: tournament.id, groupId: group.id },
      include: { team: true }
    });

    if (tTeams.length === 4) {
      const [t1, t2, t3, t4] = tTeams;
      const fixtures = [
        { h: t1, a: t2, d: 0, h_off: 0 },
        { h: t3, a: t4, d: 0, h_off: 3 },
        { h: t1, a: t3, d: 4, h_off: 0 },
        { h: t2, a: t4, d: 4, h_off: 3 },
        { h: t1, a: t4, d: 8, h_off: 0 },
        { h: t2, a: t3, d: 8, h_off: 3 }
      ];

      const groupIdx = groupName.charCodeAt(groupName.length - 1) - 65;
      const baseDate = new Date('2026-06-11T16:00:00Z');
      baseDate.setDate(baseDate.getDate() + Math.floor(groupIdx / 2));

      for (let i = 0; i < fixtures.length; i++) {
          const f = fixtures[i];
          const kickoff = new Date(baseDate);
          kickoff.setDate(kickoff.getDate() + f.d);
          kickoff.setHours(baseDate.getHours() + f.h_off);

          await prisma.match.create({
              data: {
                  id: `fwc26-group-${groupName.replace(' ', '')}-${i}`,
                  phaseId: groupPhase.id,
                  matchNumber: groupIdx * 10 + i,
                  homeTeamId: f.h.teamId,
                  awayTeamId: f.a.teamId,
                  kickoff,
                  venueId: venues[Math.floor(Math.random() * venues.length)].id,
                  status: MatchStatus.SCHEDULED
              }
          });
          totalMatchesCreated++;
      }
    }
  }

  console.log(`✅ Success. Created ${totalMatchesCreated} matches.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
