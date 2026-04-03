import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const contest = await prisma.contest.findUnique({
    where: { slug: 'afa-matchday-14' }
  });

  if (!contest) {
    console.error('Contest not found.');
    return;
  }

  console.log(`Contest UUID: ${contest.id}`);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
