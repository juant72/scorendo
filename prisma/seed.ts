import * as dotenv from 'dotenv'
dotenv.config()
import { MatchStatus } from '@prisma/client'
import { prisma } from '../src/lib/prisma'

const VENUES = [
  { name: 'MetLife Stadium', city: 'New York/New Jersey', country: 'USA', zone: 'USA_EAST', capacity: 82500 },
  { name: 'AT&T Stadium', city: 'Dallas', country: 'USA', zone: 'USA_CENTRAL', capacity: 80000 },
  { name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', zone: 'USA_CENTRAL', capacity: 76416 },
  { name: 'NRG Stadium', city: 'Houston', country: 'USA', zone: 'USA_CENTRAL', capacity: 72220 },
  { name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA', zone: 'USA_EAST', capacity: 71000 },
  { name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', zone: 'USA_WEST', capacity: 70240 },
  { name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', zone: 'USA_EAST', capacity: 69796 },
  { name: 'Lumen Field', city: 'Seattle', country: 'USA', zone: 'USA_WEST', capacity: 69000 },
  { name: "Levi's Stadium", city: 'San Francisco Bay Area', country: 'USA', zone: 'USA_WEST', capacity: 68500 },
  { name: 'Gillette Stadium', city: 'Boston', country: 'USA', zone: 'USA_EAST', capacity: 65878 },
  { name: 'Hard Rock Stadium', city: 'Miami', country: 'USA', zone: 'USA_EAST', capacity: 64767 },
  { name: 'Azteca Stadium', city: 'Mexico City', country: 'Mexico', zone: 'MEXICO', capacity: 83264 },
  { name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', zone: 'MEXICO', capacity: 53500 },
  { name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', zone: 'MEXICO', capacity: 49850 },
  { name: 'BC Place', city: 'Vancouver', country: 'Canada', zone: 'CANADA', capacity: 54500 },
  { name: 'BMO Field', city: 'Toronto', country: 'Canada', zone: 'CANADA', capacity: 30000 } // Will be expanded
] as const

const TEAMS = [
  // This is a placeholder of typical strong teams plus qualified hosts.
  // We'll enter 48 distinct teams eventually.
  { name: 'Argentina', code: 'ARG', confederation: 'CONMEBOL' },
  { name: 'Brazil', code: 'BRA', confederation: 'CONMEBOL' },
  { name: 'France', code: 'FRA', confederation: 'UEFA' },
  { name: 'England', code: 'ENG', confederation: 'UEFA' },
  { name: 'Spain', code: 'ESP', confederation: 'UEFA' },
  { name: 'Germany', code: 'GER', confederation: 'UEFA' },
  { name: 'Portugal', code: 'POR', confederation: 'UEFA' },
  { name: 'Italy', code: 'ITA', confederation: 'UEFA' },
  { name: 'Netherlands', code: 'NED', confederation: 'UEFA' },
  { name: 'Belgium', code: 'BEL', confederation: 'UEFA' },
  { name: 'United States', code: 'USA', confederation: 'CONCACAF' }, // Host
  { name: 'Mexico', code: 'MEX', confederation: 'CONCACAF' }, // Host
  { name: 'Canada', code: 'CAN', confederation: 'CONCACAF' }, // Host
  { name: 'Uruguay', code: 'URU', confederation: 'CONMEBOL' },
  { name: 'Colombia', code: 'COL', confederation: 'CONMEBOL' },
  { name: 'Croatia', code: 'CRO', confederation: 'UEFA' },
  { name: 'Morocco', code: 'MAR', confederation: 'CAF' },
  { name: 'Japan', code: 'JPN', confederation: 'AFC' },
  { name: 'Senegal', code: 'SEN', confederation: 'CAF' },
  { name: 'South Korea', code: 'KOR', confederation: 'AFC' },
  { name: 'Switzerland', code: 'SUI', confederation: 'UEFA' },
  { name: 'Denmark', code: 'DEN', confederation: 'UEFA' },
  { name: 'Ecuador', code: 'ECU', confederation: 'CONMEBOL' },
  { name: 'Serbia', code: 'SRB', confederation: 'UEFA' },
  { name: 'Iran', code: 'IRN', confederation: 'AFC' },
  { name: 'Australia', code: 'AUS', confederation: 'AFC' },
  { name: 'Austria', code: 'AUT', confederation: 'UEFA' },
  { name: 'Sweden', code: 'SWE', confederation: 'UEFA' },
  { name: 'Turkiye', code: 'TUR', confederation: 'UEFA' },
  { name: 'Hungary', code: 'HUN', confederation: 'UEFA' },
  { name: 'Wales', code: 'WAL', confederation: 'UEFA' },
  { name: 'Poland', code: 'POL', confederation: 'UEFA' },
  { name: 'Egypt', code: 'EGY', confederation: 'CAF' },
  { name: 'Nigeria', code: 'NGA', confederation: 'CAF' },
  { name: 'Algeria', code: 'ALG', confederation: 'CAF' },
  { name: 'Saudi Arabia', code: 'KSA', confederation: 'AFC' },
  { name: 'Peru', code: 'PER', confederation: 'CONMEBOL' },
  { name: 'Chile', code: 'CHI', confederation: 'CONMEBOL' },
  { name: 'Venezuela', code: 'VEN', confederation: 'CONMEBOL' },
  { name: 'Paraguay', code: 'PAR', confederation: 'CONMEBOL' },
  { name: 'Ivory Coast', code: 'CIV', confederation: 'CAF' },
  { name: 'Ghana', code: 'GHA', confederation: 'CAF' },
  { name: 'Qatar', code: 'QAT', confederation: 'AFC' },
  { name: 'New Zealand', code: 'NZL', confederation: 'OFC' },
  { name: 'Scotland', code: 'SCO', confederation: 'UEFA' },
  { name: 'Czechia', code: 'CZE', confederation: 'UEFA' },
  { name: 'Norway', code: 'NOR', confederation: 'UEFA' },
  { name: 'Slovakia', code: 'SVK', confederation: 'UEFA' } // Brings total to 48 exactly
]

const PHASES = [
  { name: 'Group Stage', slug: 'group-stage', order: 1, startDate: new Date('2026-06-11'), endDate: new Date('2026-06-27'), multiplier: 1.0 },
  { name: 'Round of 32', slug: 'round-of-32', order: 2, startDate: new Date('2026-06-28'), endDate: new Date('2026-07-03'), multiplier: 1.25 },
  { name: 'Round of 16', slug: 'round-of-16', order: 3, startDate: new Date('2026-07-04'), endDate: new Date('2026-07-07'), multiplier: 1.5 },
  { name: 'Quarter-finals', slug: 'quarter-finals', order: 4, startDate: new Date('2026-07-09'), endDate: new Date('2026-07-11'), multiplier: 2.0 },
  { name: 'Semi-finals', slug: 'semi-finals', order: 5, startDate: new Date('2026-07-14'), endDate: new Date('2026-07-15'), multiplier: 2.5 },
  { name: 'Third Place Play-off', slug: 'third-place', order: 6, startDate: new Date('2026-07-18'), endDate: new Date('2026-07-18'), multiplier: 2.0 },
  { name: 'Final', slug: 'final', order: 7, startDate: new Date('2026-07-19'), endDate: new Date('2026-07-19'), multiplier: 3.0 }
]

async function main() {
  console.log('Seeding multisport database...')

  // 1. Create Sports
  const football = await prisma.sport.upsert({
    where: { slug: 'football' },
    update: {},
    create: { name: 'Fútbol', slug: 'football', type: 'TEAM_VS_TEAM' }
  });

  const motorsports = await prisma.sport.upsert({
    where: { slug: 'motorsports' },
    update: {},
    create: { name: 'Automovilismo', slug: 'motorsports', type: 'RACING' }
  });

  const nba = await prisma.sport.upsert({
    where: { slug: 'nba' },
    update: {},
    create: { name: 'Basquet NBA', slug: 'nba', type: 'TEAM_VS_TEAM' }
  });

  // 2. Create Competitions
  const worldCupComp = await prisma.competition.upsert({
    where: { slug: 'fifa-world-cup-2026' },
    update: { sportId: football.id },
    create: { name: 'FIFA World Cup 2026', slug: 'fifa-world-cup-2026', sportId: football.id, category: 'International' }
  });

  const f1Comp = await prisma.competition.upsert({
    where: { slug: 'f1-world-championship' },
    update: { sportId: motorsports.id },
    create: { name: 'F1 World Championship', slug: 'f1-world-championship', sportId: motorsports.id, category: 'Professional' }
  });

  const nbaComp = await prisma.competition.upsert({
    where: { slug: 'nba-season' },
    update: { sportId: nba.id },
    create: { name: 'NBA Regular Season', slug: 'nba-season', sportId: nba.id, category: 'Professional' }
  });

  // 3. Venues
  for (const v of VENUES) {
    await prisma.venue.upsert({
      where: { id: v.name.replace(/\s+/g, '-').toLowerCase() },
      update: {},
      create: { name: v.name, city: v.city, country: v.country, zone: v.zone, capacity: v.capacity }
    });
  }

  // 4. Teams
  for (const t of TEAMS) {
    await prisma.team.upsert({
      where: { code: t.code },
      update: {},
      create: { name: t.name, code: t.code, confederation: t.confederation }
    });
  }

  // 5. Tournaments
  const worldCupTournament = await prisma.tournament.upsert({
    where: { slug: 'fifa-world-cup-2026' },
    update: { competitionId: worldCupComp.id },
    create: { name: 'FIFA World Cup 2026™ Edition', slug: 'fifa-world-cup-2026', startDate: new Date('2026-06-11'), endDate: new Date('2026-07-19'), status: 'UPCOMING', competitionId: worldCupComp.id }
  });

  const f12025 = await prisma.tournament.upsert({
    where: { slug: 'f1-season-2025' },
    update: { competitionId: f1Comp.id },
    create: { name: 'F1 2025 Season', slug: 'f1-season-2025', startDate: new Date('2025-03-01'), endDate: new Date('2025-11-30'), status: 'UPCOMING', competitionId: f1Comp.id }
  });

  // 6. Phases
  for (const p of PHASES) {
    await prisma.phase.upsert({
      where: { tournamentId_slug: { tournamentId: worldCupTournament.id, slug: p.slug } },
      update: {},
      create: {
        tournamentId: worldCupTournament.id,
        name: p.name,
        slug: p.slug,
        order: p.order,
        startDate: p.startDate,
        endDate: p.endDate,
        multiplier: p.multiplier
      }
    });
  }

  // 7. Contests (Hierarchical variety)
  // World Cup Full Tournament
  await prisma.contest.upsert({
    where: { slug: 'world-cup-2026-global' },
    update: { tournamentId: worldCupTournament.id },
    create: {
      name: 'World Cup 2026: Full Tournament',
      slug: 'world-cup-2026-global',
      description: 'Predict everything from Group Stage to Final.',
      type: 'GRAND_TOURNAMENT',
      tier: 'FREE',
      distribution: { "1": 0.5, "2": 0.3, "3": 0.2 },
      tournamentId: worldCupTournament.id,
      startDate: new Date('2026-06-11'),
      endDate: new Date('2026-07-19'),
      registrationEnd: new Date('2026-06-11'),
      prizePool: BigInt(50000000000),
      currentEntries: 12500
    }
  });

  // World Cup Opening Day (By Date/Day)
  await prisma.contest.upsert({
    where: { slug: 'wc2026-opening-day' },
    update: { tournamentId: worldCupTournament.id },
    create: {
      name: 'World Cup: Opening Day Battles',
      slug: 'wc2026-opening-day',
      description: 'Predict the first 3 opening matches accurately.',
      type: 'MATCH_DAY',
      tier: 'STANDARD',
      entryFeeSOL: 0.1,
      distribution: { "1": 1.0 },
      tournamentId: worldCupTournament.id,
      startDate: new Date('2026-06-11'),
      endDate: new Date('2026-06-11'),
      registrationEnd: new Date('2026-06-11'),
      prizePool: BigInt(10000000000)
    }
  });

  // F1 Annual Championship
  await prisma.contest.upsert({
    where: { slug: 'f1-2025-annual' },
    update: { tournamentId: f12025.id },
    create: {
      name: 'F1 2025: Annual Championship',
      slug: 'f1-2025-annual',
      description: 'The long game. Predict the full season winner and podiums.',
      type: 'GRAND_TOURNAMENT',
      tier: 'FREE',
      distribution: { "1": 1.0 },
      tournamentId: f12025.id,
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-11-30'),
      registrationEnd: new Date('2025-03-01'),
      prizePool: BigInt(50000000000)
    }
  });

  // F1 GP Mónaco Specific (By Event/Date)
  await prisma.contest.upsert({
    where: { slug: 'f1-2025-monaco-gp' },
    update: { tournamentId: f12025.id },
    create: {
      name: 'F1: Grand Prix de Monaco Special',
      slug: 'f1-2025-monaco-gp',
      description: 'Specific event contest for the most iconic street circuit.',
      type: 'MATCH_DAY',
      tier: 'STANDARD',
      entryFeeSOL: 0.05,
      distribution: { "1": 1.0 },
      tournamentId: f12025.id,
      startDate: new Date('2025-05-25'),
      endDate: new Date('2025-05-25'),
      registrationEnd: new Date('2025-05-25'),
      prizePool: BigInt(5000000000)
    }
  });

  console.log('Seeding multisport completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

