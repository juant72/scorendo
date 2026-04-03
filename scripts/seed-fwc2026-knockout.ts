import { PrismaClient, MatchStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Generating Knockout Placeholders for FIFA World Cup 2026...');

  const tournament = await prisma.tournament.findUnique({
    where: { slug: 'fifa-world-cup-2026' }
  });

  if (!tournament) return;

  const phases = await prisma.phase.findMany({
    where: { tournamentId: tournament.id, NOT: { slug: 'group-stage' } }
  });

  const venues = await prisma.venue.findMany();

  // Create "TBD" teams or just use existing ones as placeholders
  // Actually, I'll create 2 generic teams "Winner Group A" and "Runner-up Group B" etc. if they don't exist.
  // But let's just use existing top teams as placeholders for now to keep the UI beautiful.
  
  const topTeams = await prisma.team.findMany({ take: 10 });

  for (const phase of phases) {
    console.log(`Generating matches for ${phase.name}...`);
    const numMatches = phase.slug === 'final' ? 1 : 
                       phase.slug === 'semi-finals' ? 2 :
                       phase.slug === 'quarter-finals' ? 4 :
                       phase.slug === 'round-of-16' ? 8 : 16;

    for (let i = 0; i < numMatches; i++) {
        const home = topTeams[Math.floor(Math.random() * topTeams.length)];
        const away = topTeams[Math.floor(Math.random() * topTeams.length)];
        const matchDate = new Date(phase.startDate);
        matchDate.setHours(20 + i, 0, 0, 0);

        await prisma.match.upsert({
            where: { id: `fwc26-knockout-${phase.slug}-${i}` },
            update: {},
            create: {
                id: `fwc26-knockout-${phase.slug}-${i}`,
                phaseId: phase.id,
                matchNumber: 100 + i,
                homeTeamId: home.id,
                awayTeamId: away.id,
                kickoff: matchDate,
                venueId: venues[0].id,
                status: MatchStatus.SCHEDULED
            }
        });
    }
  }

  console.log('✅ Knockout Placeholders generated.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
