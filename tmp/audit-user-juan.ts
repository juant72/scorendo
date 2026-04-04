import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { displayName: { contains: 'JUAN TAPIA' } },
    include: {
      predictions: {
        include: {
          match: true
        }
      }
    }
  });

  if (!user) {
    console.log('User not found.');
    return;
  }

  console.log(`User: ${user.displayName}`);
  console.log(`Global totalPoints: ${user.totalPoints}`);
  console.log('--- Prediction Breakdown ---');
  
  user.predictions.forEach(p => {
    if (p.scored) {
      console.log(`Match: ${p.match.id} | Result: ${p.match.homeScore}-${p.match.awayScore} | Pred: ${p.predictedHome}-${p.predictedAway}`);
      console.log(`Points Earned: ${p.pointsEarned}`);
      console.log('---');
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
