
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkData() {
  const sports = await prisma.sport.findMany();
  console.log('SPORTS:', sports);

  const competitions = await prisma.competition.findMany({
    include: { sport: true }
  });
  console.log('COMPETITIONS:', competitions.map(c => ({ 
    id: c.id, 
    name: c.name, 
    sport: c.sport?.name, 
    sportSlug: c.sport?.slug 
  })));
}

checkData();
