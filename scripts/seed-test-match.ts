import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- SCORENDO TEST SEEDER ---');
  
  // 1. Find the first scheduled match
  const match = await prisma.match.findFirst({
    where: { status: 'SCHEDULED' },
    include: { homeTeam: true, awayTeam: true }
  });

  if (!match) {
    console.error('No scheduled matches found to seed.');
    return;
  }

  console.log(`Found Match: ${match.homeTeam.code} vs ${match.awayTeam.code}`);

  // 2. Move kickoff to 1 hour ago
  const targetKickoff = new Date(Date.now() - 60 * 60 * 1000);
  
  await prisma.match.update({
    where: { id: match.id },
    data: { 
      kickoff: targetKickoff,
      status: 'SCHEDULED' // Keep as scheduled so oracle can pick it up
    }
  });

  console.log(`Updated Match ID: ${match.id}`);
  console.log(`New Kickoff: ${targetKickoff.toISOString()}`);
  console.log('--- SEEDING COMPLETE ---');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
