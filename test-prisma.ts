import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const contests = await prisma.contest.findMany({ take: 1 });
  console.log('Contests count:', contests.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
