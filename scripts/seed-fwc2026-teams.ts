import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REAL_TEAMS = [
  { name: 'Mexico', code: 'MEX', confederation: 'CONCACAF' },
  { name: 'South Africa', code: 'RSA', confederation: 'CAF' },
  { name: 'South Korea', code: 'KOR', confederation: 'AFC' },
  { name: 'Czechia', code: 'CZE', confederation: 'UEFA' },
  { name: 'Canada', code: 'CAN', confederation: 'CONCACAF' },
  { name: 'Switzerland', code: 'SUI', confederation: 'UEFA' },
  { name: 'Qatar', code: 'QAT', confederation: 'AFC' },
  { name: 'Bosnia and Herzegovina', code: 'BIH', confederation: 'UEFA' },
  { name: 'Brazil', code: 'BRA', confederation: 'CONMEBOL' },
  { name: 'Morocco', code: 'MAR', confederation: 'CAF' },
  { name: 'Haiti', code: 'HAI', confederation: 'CONCACAF' },
  { name: 'Scotland', code: 'SCO', confederation: 'UEFA' },
  { name: 'United States', code: 'USA', confederation: 'CONCACAF' },
  { name: 'Paraguay', code: 'PAR', confederation: 'CONMEBOL' },
  { name: 'Australia', code: 'AUS', confederation: 'AFC' },
  { name: 'Türkiye', code: 'TUR', confederation: 'UEFA' },
  { name: 'Germany', code: 'GER', confederation: 'UEFA' },
  { name: 'Ecuador', code: 'ECU', confederation: 'CONMEBOL' },
  { name: 'Ivory Coast', code: 'CIV', confederation: 'CAF' },
  { name: 'Curaçao', code: 'CUR', confederation: 'CONCACAF' },
  { name: 'Netherlands', code: 'NED', confederation: 'UEFA' },
  { name: 'Japan', code: 'JPN', confederation: 'AFC' },
  { name: 'Tunisia', code: 'TUN', confederation: 'CAF' },
  { name: 'Sweden', code: 'SWE', confederation: 'UEFA' },
  { name: 'Belgium', code: 'BEL', confederation: 'UEFA' },
  { name: 'Iran', code: 'IRN', confederation: 'AFC' },
  { name: 'Egypt', code: 'EGY', confederation: 'CAF' },
  { name: 'New Zealand', code: 'NZL', confederation: 'OFC' },
  { name: 'Spain', code: 'ESP', confederation: 'UEFA' },
  { name: 'Uruguay', code: 'URU', confederation: 'CONMEBOL' },
  { name: 'Saudi Arabia', code: 'KSA', confederation: 'AFC' },
  { name: 'Cape Verde', code: 'CPV', confederation: 'CAF' },
  { name: 'France', code: 'FRA', confederation: 'UEFA' },
  { name: 'Senegal', code: 'SEN', confederation: 'CAF' },
  { name: 'Norway', code: 'NOR', confederation: 'UEFA' },
  { name: 'Iraq', code: 'IRQ', confederation: 'AFC' },
  { name: 'Argentina', code: 'ARG', confederation: 'CONMEBOL' },
  { name: 'Algeria', code: 'ALG', confederation: 'CAF' },
  { name: 'Austria', code: 'AUT', confederation: 'UEFA' },
  { name: 'Jordan', code: 'JOR', confederation: 'AFC' },
  { name: 'Portugal', code: 'POR', confederation: 'UEFA' },
  { name: 'Colombia', code: 'COL', confederation: 'CONMEBOL' },
  { name: 'Uzbekistan', code: 'UZB', confederation: 'AFC' },
  { name: 'DR Congo', code: 'COD', confederation: 'CAF' },
  { name: 'England', code: 'ENG', confederation: 'UEFA' },
  { name: 'Croatia', code: 'CRO', confederation: 'UEFA' },
  { name: 'Ghana', code: 'GHA', confederation: 'CAF' },
  { name: 'Panama', code: 'PAN', confederation: 'CONCACAF' }
];

async function main() {
  console.log('🌱 Seeding Real 48 Teams for FWC 2026...');
  for (const t of REAL_TEAMS) {
    await prisma.team.upsert({
      where: { code: t.code },
      update: { name: t.name, confederation: t.confederation },
      create: t
    });
  }
  console.log('✅ Teams seeded.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
