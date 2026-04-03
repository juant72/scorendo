import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const match = await prisma.match.findUnique({
    where: { id: 'afa-md14-1' },
    include: {
      phase: {
        include: {
          contests: true
        }
      }
    }
  });

  if (!match || !match.phase || match.phase.contests.length === 0) {
    console.error('Match not found or no associated contests.');
    return;
  }

  console.log(`Match: ${match.id} is in Contest: ${match.phase.contests[0].slug}`);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
