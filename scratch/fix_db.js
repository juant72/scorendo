
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixData() {
  try {
    const football = await prisma.sport.findUnique({ where: { slug: 'football' } });
    if (!football) {
      console.log('Football sport not found!');
      process.exit(1);
    }

    // Fix Argentine Football First Div
    await prisma.competition.updateMany({
      where: { name: { contains: 'Argentine' } },
      data: { sportId: football.id }
    });

    // Fix European Champions Cup
    await prisma.competition.updateMany({
      where: { name: { contains: 'European' } },
      data: { sportId: football.id }
    });

    console.log('Data fixed successfully!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

fixData();
