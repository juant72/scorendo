
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const sports = await prisma.sport.findMany();
    console.log('SPORTS ON DB:');
    sports.forEach(s => console.log(`- ${s.name} (Slug: ${s.slug})`));

    const comps = await prisma.competition.findMany({
      include: { sport: true }
    });
    console.log('\nCOMPETITIONS ON DB:');
    comps.forEach(c => {
      console.log(`- ${c.name} (Sport: ${c.sport?.name || 'NONE'}, SportSlug: ${c.sport?.slug || 'NONE'})`);
    });

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

checkData();
