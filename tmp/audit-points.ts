import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SCORENDO POINT AUDIT ---');
  
  const users = await prisma.user.findMany({
    orderBy: { xp: 'desc' }, // or points if it exists
    include: {
      _count: {
        select: { predictions: true }
      }
    }
  });

  users.forEach(u => {
    console.log(`User: ${u.displayName || u.walletAddress}`);
    console.log(`- XP: ${u.xp}`);
    console.log(`- Level: ${u.level}`);
    console.log(`- Predictions: ${u._count.predictions}`);
    console.log('-----------------------------');
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
