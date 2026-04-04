import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { 
      walletAddress: true, 
      displayName: true, 
      email: true, 
      totalPoints: true 
    }
  });

  console.log('--- ALL USERS DUMP ---');
  users.forEach(u => {
    console.log(`Wallet: ${u.walletAddress} | Name: ${u.displayName} | Score: ${u.totalPoints}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
