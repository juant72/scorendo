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
  console.log('Seeding database...')

  // 1. Venues
  for (const v of VENUES) {
    await prisma.venue.upsert({
      where: { id: v.name.replace(/\s+/g, '-').toLowerCase() }, // Fake ID for simplificty or let it autogenerate (we'll look it up)
      update: {},
      create: {
        name: v.name,
        city: v.city,
        country: v.country,
        zone: v.zone,
        capacity: v.capacity
      }
    })
  }

  // 2. Teams
  for (const t of TEAMS) {
    await prisma.team.upsert({
      where: { code: t.code },
      update: {},
      create: {
        name: t.name,
        code: t.code,
        confederation: t.confederation
      }
    })
  }

  // 3. Tournament
  const tournament = await prisma.tournament.upsert({
    where: { slug: 'fifa-world-cup-2026' },
    update: {},
    create: {
      name: 'FIFA World Cup 2026™',
      slug: 'fifa-world-cup-2026',
      startDate: new Date('2026-06-11'),
      endDate: new Date('2026-07-19'),
      status: 'UPCOMING'
    }
  })

  // 4. Phases
  for (const p of PHASES) {
    await prisma.phase.upsert({
      where: { tournamentId_slug: { tournamentId: tournament.id, slug: p.slug } },
      update: {},
      create: {
        tournamentId: tournament.id,
        name: p.name,
        slug: p.slug,
        order: p.order,
        startDate: p.startDate,
        endDate: p.endDate,
        multiplier: p.multiplier
      }
    })
  }

  // 5. Setup tournament teams
  const dbTeams = await prisma.team.findMany()
  for (const t of dbTeams) {
    await prisma.tournamentTeam.upsert({
      where: { teamId_tournamentId: { teamId: t.id, tournamentId: tournament.id } },
      update: {},
      create: {
        teamId: t.id,
        tournamentId: tournament.id
      }
    })
  }

  // 6. Groups (A to L for 48 teams)
  const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
  const groupPhase = await prisma.phase.findFirst({ where: { slug: 'group-stage' } })
  const tTeams = await prisma.tournamentTeam.findMany({ include: { team: true } })

  if (groupPhase && tTeams.length === 48) {
    for (let i = 0; i < groupLetters.length; i++) {
      const letter = groupLetters[i]
      const group = await prisma.group.upsert({
        where: { phaseId_name: { phaseId: groupPhase.id, name: `Group ${letter}` } },
        update: {},
        create: {
          phaseId: groupPhase.id,
          name: `Group ${letter}`
        }
      })

      // Assign 4 teams to each group sequentially just for seeding
      const groupTeams = tTeams.slice(i * 4, (i + 1) * 4)
      for (const gt of groupTeams) {
        await prisma.tournamentTeam.update({
          where: { id: gt.id },
          data: { groupId: group.id }
        })
      }
    }
  }

  // 7. Dummy/Mock Matches (Real-life Opening Matches of 2026 World Cup)
  // groupPhase is already declared above
  const azteca = await prisma.venue.findFirst({ where: { name: 'Azteca Stadium' } })
  const sofi = await prisma.venue.findFirst({ where: { name: 'SoFi Stadium' } })
  const bmo = await prisma.venue.findFirst({ where: { name: 'BMO Field' } })
  const metlife = await prisma.venue.findFirst({ where: { name: 'MetLife Stadium' } })

  const mex = await prisma.team.findUnique({ where: { code: 'MEX' } })
  const usa = await prisma.team.findUnique({ where: { code: 'USA' } })
  const can = await prisma.team.findUnique({ where: { code: 'CAN' } })
  const arg = await prisma.team.findUnique({ where: { code: 'ARG' } })
  const bra = await prisma.team.findUnique({ where: { code: 'BRA' } })
  const eng = await prisma.team.findUnique({ where: { code: 'ENG' } })

  let m1, m2, m3;

  if (groupPhase && azteca && sofi && bmo && metlife && mex && usa && can && arg && bra && eng) {
    // Math 1: Opening Match at Azteca
    m1 = await prisma.match.upsert({
      where: { id: 'match-1' },
      update: {},
      create: { id: 'match-1', phaseId: groupPhase.id, matchNumber: 1, homeTeamId: mex.id, awayTeamId: eng.id, venueId: azteca.id, kickoff: new Date('2026-06-11T20:00:00Z'), status: MatchStatus.SCHEDULED }
    })
    // Match 2: USA Opening at SoFi
    m2 = await prisma.match.upsert({
      where: { id: 'match-2' },
      update: {},
      create: { id: 'match-2', phaseId: groupPhase.id, matchNumber: 2, homeTeamId: usa.id, awayTeamId: arg.id, venueId: sofi.id, kickoff: new Date('2026-06-12T20:00:00Z'), status: MatchStatus.SCHEDULED }
    })
    // Match 3: CAN Opening at BMO
    m3 = await prisma.match.upsert({
      where: { id: 'match-3' },
      update: {},
      create: { id: 'match-3', phaseId: groupPhase.id, matchNumber: 3, homeTeamId: can.id, awayTeamId: bra.id, venueId: bmo.id, kickoff: new Date('2026-06-12T23:00:00Z'), status: MatchStatus.SCHEDULED }
    })
  }

  // 8. Contests (For User to interact in Lobby)
  const globContest = await prisma.contest.upsert({
    where: { slug: 'world-cup-2026-global' },
    update: {},
    create: {
      name: 'Global World Cup Prediction Pool',
      slug: 'world-cup-2026-global',
      description: 'Predict all matches throughout the tournament and win the Grand Prize. Entry is free!',
      type: 'GRAND_TOURNAMENT',
      tier: 'FREE',
      entryFeeLamports: BigInt(0),
      entryFeeSOL: 0,
      prizePool: BigInt(50000000000), // 50 SOL (for MVP display)
      distribution: { "1": 0.5, "2": 0.3, "3": 0.2 },
      tournamentId: tournament.id,
      startDate: new Date('2026-06-11T20:00:00Z'),
      endDate: new Date('2026-07-19T23:59:59Z'),
      registrationEnd: new Date('2026-06-11T20:00:00Z'),
      status: 'REGISTRATION',
      minParticipants: 10,
      maxParticipants: 1000000,
      currentEntries: 12543
    }
  })

  await prisma.contest.upsert({
    where: { slug: 'opening-weekend-battle' },
    update: {},
    create: {
      name: 'Opening Weekend High-Roller',
      slug: 'opening-weekend-battle',
      description: 'Predict the first 3 opening matches correctly. Winner takes all.',
      type: 'MATCH_DAY',
      tier: 'PREMIUM',
      entryFeeLamports: BigInt(1000000000), // 1 SOL
      entryFeeSOL: 1,
      prizePool: BigInt(15000000000), // 15 SOL
      distribution: { "1": 1.0 },
      phaseId: groupPhase?.id,
      startDate: new Date('2026-06-11T20:00:00Z'),
      endDate: new Date('2026-06-13T23:59:59Z'),
      registrationEnd: new Date('2026-06-11T20:00:00Z'),
      status: 'UPCOMING',
      minParticipants: 2,
      maxParticipants: 100,
      currentEntries: 14
    }
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
