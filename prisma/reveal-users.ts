import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- REVEALING ALL IDENTITY SIGNATURES ---');
  const users = await prisma.user.findMany({
    select: { 
      walletAddress: true, 
      displayName: true, 
      totalPoints: true,
      xp: true,
      level: true
    }
  });

  users.forEach(u => {
    console.log(`[USER] Name: ${u.displayName} | Points: ${u.totalPoints} | Wallet: ${u.walletAddress}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
