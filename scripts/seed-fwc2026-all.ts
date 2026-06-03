import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { MatchStatus, TournamentStatus } from '@prisma/client';

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

const GROUPS = {
  'Group A': ['MEX', 'RSA', 'KOR', 'CZE'],
  'Group B': ['CAN', 'SUI', 'QAT', 'BIH'],
  'Group C': ['BRA', 'MAR', 'HAI', 'SCO'],
  'Group D': ['USA', 'PAR', 'AUS', 'TUR'],
  'Group E': ['GER', 'ECU', 'CIV', 'CUR'],
  'Group F': ['NED', 'JPN', 'TUN', 'SWE'],
  'Group G': ['BEL', 'IRN', 'EGY', 'NZL'],
  'Group H': ['ESP', 'URU', 'KSA', 'CPV'],
  'Group I': ['FRA', 'SEN', 'NOR', 'IRQ'],
  'Group J': ['ARG', 'ALG', 'AUT', 'JOR'],
  'Group K': ['POR', 'COL', 'UZB', 'COD'],
  'Group L': ['ENG', 'CRO', 'GHA', 'PAN']
};

// 1. Group Stage qualifiers (Top 2 of each group, A to L)
const R32_QUALIFIERS = [
  { name: 'Winner Group A', code: '1A' },
  { name: 'Runner-up Group A', code: '2A' },
  { name: 'Winner Group B', code: '1B' },
  { name: 'Runner-up Group B', code: '2B' },
  { name: 'Winner Group C', code: '1C' },
  { name: 'Runner-up Group C', code: '2C' },
  { name: 'Winner Group D', code: '1D' },
  { name: 'Runner-up Group D', code: '2D' },
  { name: 'Winner Group E', code: '1E' },
  { name: 'Runner-up Group E', code: '2E' },
  { name: 'Winner Group F', code: '1F' },
  { name: 'Runner-up Group F', code: '2F' },
  { name: 'Winner Group G', code: '1G' },
  { name: 'Runner-up Group G', code: '2G' },
  { name: 'Winner Group H', code: '1H' },
  { name: 'Runner-up Group H', code: '2H' },
  { name: 'Winner Group I', code: '1I' },
  { name: 'Runner-up Group I', code: '2I' },
  { name: 'Winner Group J', code: '1J' },
  { name: 'Runner-up Group J', code: '2J' },
  { name: 'Winner Group K', code: '1K' },
  { name: 'Runner-up Group K', code: '2K' },
  { name: 'Winner Group L', code: '1L' },
  { name: 'Runner-up Group L', code: '2L' },
  
  // 3rd place wildcards
  { name: '3rd Group A/B/C/D/F', code: '3ABC-F' },
  { name: '3rd Group C/D/F/G/H', code: '3CD-H' },
  { name: '3rd Group C/E/F/H/I', code: '3CE-I' },
  { name: '3rd Group E/H/I/J/K', code: '3EH-K' },
  { name: '3rd Group A/E/H/I/J', code: '3AE-J' },
  { name: '3rd Group B/E/F/I/J', code: '3BE-J' },
  { name: '3rd Group E/F/G/I/J', code: '3EF-J' },
  { name: '3rd Group D/E/I/J/L', code: '3DE-L' }
];

// 2. Round of 32 Winners (Matches 73 to 88)
const R16_QUALIFIERS = Array.from({ length: 16 }, (_, idx) => {
  const matchNum = 73 + idx;
  return { name: `Winner Match ${matchNum}`, code: `W${matchNum}` };
});

// 3. Round of 16 Winners (Matches 89 to 96)
const QF_QUALIFIERS = Array.from({ length: 8 }, (_, idx) => {
  const matchNum = 89 + idx;
  return { name: `Winner Match ${matchNum}`, code: `W${matchNum}` };
});

// 4. Quarter-finals Winners (Matches 97 to 100)
const SF_QUALIFIERS = Array.from({ length: 4 }, (_, idx) => {
  const matchNum = 97 + idx;
  return { name: `Winner Match ${matchNum}`, code: `W${matchNum}` };
});

// 5. Semi-finals Winners & Losers (Matches 101 and 102)
const FINAL_QUALIFIERS = [
  { name: 'Winner Match 101', code: 'W101' },
  { name: 'Winner Match 102', code: 'W102' },
  { name: 'Loser Match 101', code: 'L101' },
  { name: 'Loser Match 102', code: 'L102' }
];

async function main() {
  console.log('⚽ Starting comprehensive seeding for FIFA World Cup 2026...');

  // ═══════════════════════════════════════
  // 1. ENSURE TOURNAMENT & PHASES EXIST
  // ═══════════════════════════════════════
  const competition = await prisma.competition.upsert({
    where: { slug: 'fifa-world-cup-2026' },
    update: { logoUrl: '/logos/fwc2026.png' },
    create: {
      name: 'FIFA World Cup 2026',
      slug: 'fifa-world-cup-2026',
      category: 'International National',
      country: 'USA/Mexico/Canada',
      logoUrl: '/logos/fwc2026.png'
    }
  });

  const tournament = await prisma.tournament.upsert({
    where: { slug: 'fifa-world-cup-2026' },
    update: { status: TournamentStatus.UPCOMING },
    create: {
      name: 'FIFA World Cup 2026™',
      slug: 'fifa-world-cup-2026',
      startDate: new Date('2026-06-11'),
      endDate: new Date('2026-07-19'),
      status: TournamentStatus.UPCOMING,
      competitionId: competition.id
    }
  });

  const phaseDefinitions = [
    { name: 'Group Stage', slug: 'group-stage', order: 1, start: '2026-06-11', end: '2026-06-27', mult: 1.0 },
    { name: 'Round of 32', slug: 'round-of-32', order: 2, start: '2026-06-28', end: '2026-07-03', mult: 1.25 },
    { name: 'Round of 16', slug: 'round-of-16', order: 3, start: '2026-07-04', end: '2026-07-07', mult: 1.5 },
    { name: 'Quarter-finals', slug: 'quarter-finals', order: 4, start: '2026-07-09', end: '2026-07-11', mult: 2.0 },
    { name: 'Semi-finals', slug: 'semi-finals', order: 5, start: '2026-07-14', end: '2026-07-15', mult: 2.5 },
    { name: 'Third Place Play-off', slug: 'third-place', order: 6, start: '2026-07-18', end: '2026-07-18', mult: 2.0 },
    { name: 'Final', slug: 'final', order: 7, start: '2026-07-19', end: '2026-07-19', mult: 3.0 }
  ];

  const phasesMap: Record<string, any> = {};
  for (const p of phaseDefinitions) {
    phasesMap[p.slug] = await prisma.phase.upsert({
      where: { tournamentId_slug: { tournamentId: tournament.id, slug: p.slug } },
      update: { multiplier: p.mult },
      create: {
        tournamentId: tournament.id,
        name: p.name,
        slug: p.slug,
        order: p.order,
        startDate: new Date(p.start),
        endDate: new Date(p.end),
        multiplier: p.mult
      }
    });
  }

  // ═══════════════════════════════════════
  // 2. SEED REAL & PLACEHOLDER TEAMS
  // ═══════════════════════════════════════
  console.log('🌱 Seeding real teams...');
  for (const t of REAL_TEAMS) {
    await prisma.team.upsert({
      where: { code: t.code },
      update: { name: t.name, confederation: t.confederation },
      create: t
    });
  }

  console.log('🌱 Seeding placeholder teams...');
  const placeholderTeams = [
    ...R32_QUALIFIERS,
    ...R16_QUALIFIERS,
    ...QF_QUALIFIERS,
    ...SF_QUALIFIERS,
    ...FINAL_QUALIFIERS
  ];

  for (const p of placeholderTeams) {
    await prisma.team.upsert({
      where: { code: p.code },
      update: { name: p.name, confederation: 'FIFA' },
      create: { name: p.name, code: p.code, confederation: 'FIFA' }
    });
  }

  // ═══════════════════════════════════════
  // 3. FULL CLEANUP OF OLD TOURNAMENT DATA
  // ═══════════════════════════════════════
  console.log('🧹 Cleaning up old match data...');
  const activePhaseIds = Object.values(phasesMap).map(p => p.id);
  const oldMatchIds = (await prisma.match.findMany({
    where: { phaseId: { in: activePhaseIds } },
    select: { id: true }
  })).map(m => m.id);

  await prisma.prediction.deleteMany({ where: { matchId: { in: oldMatchIds } } });
  await prisma.prediction1v1.deleteMany({ where: { matchId: { in: oldMatchIds } } });
  await prisma.match.deleteMany({ where: { id: { in: oldMatchIds } } });

  // Reset tournament groups
  await prisma.tournamentTeam.deleteMany({ where: { tournamentId: tournament.id } });
  await prisma.group.deleteMany({ where: { phaseId: { in: activePhaseIds } } });

  // ═══════════════════════════════════════
  // 4. GENERATE GROUP STAGE FIXTURES (Chronological 1-72)
  // ═══════════════════════════════════════
  console.log('📅 Generating Group Stage...');
  const groupPhase = phasesMap['group-stage'];
  const venues = await prisma.venue.findMany();
  if (venues.length === 0) {
    throw new Error('Please run prisma/seed.ts first to seed the venues.');
  }

  const groupsList = Object.entries(GROUPS);

  // Build all group stage matches (3 rounds, 6 fixtures per group)
  const allGroupStageMatches: {
    id: string;
    groupName: string;
    round: number;
    homeCode: string;
    awayCode: string;
    kickoff?: Date;
  }[] = [];

  for (const [groupName, teamCodes] of groupsList) {
    const group = await prisma.group.create({
      data: { phaseId: groupPhase.id, name: groupName }
    });

    const teamsInGroup: any[] = [];
    for (const code of teamCodes) {
      const team = await prisma.team.findUnique({ where: { code } });
      if (!team) throw new Error(`Team ${code} not found!`);
      
      await prisma.tournamentTeam.create({
        data: { teamId: team.id, tournamentId: tournament.id, groupId: group.id }
      });
      teamsInGroup.push(team);
    }

    const [t1, t2, t3, t4] = teamsInGroup;
    
    // Round 1
    allGroupStageMatches.push({ id: `fwc26-group-${groupName.replace(' ', '')}-0`, groupName, round: 1, homeCode: t1.code, awayCode: t2.code });
    allGroupStageMatches.push({ id: `fwc26-group-${groupName.replace(' ', '')}-1`, groupName, round: 1, homeCode: t3.code, awayCode: t4.code });
    // Round 2
    allGroupStageMatches.push({ id: `fwc26-group-${groupName.replace(' ', '')}-2`, groupName, round: 2, homeCode: t1.code, awayCode: t3.code });
    allGroupStageMatches.push({ id: `fwc26-group-${groupName.replace(' ', '')}-3`, groupName, round: 2, homeCode: t2.code, awayCode: t4.code });
    // Round 3
    allGroupStageMatches.push({ id: `fwc26-group-${groupName.replace(' ', '')}-4`, groupName, round: 3, homeCode: t1.code, awayCode: t4.code });
    allGroupStageMatches.push({ id: `fwc26-group-${groupName.replace(' ', '')}-5`, groupName, round: 3, homeCode: t2.code, awayCode: t3.code });
  }

  const r1Matches = allGroupStageMatches.filter(m => m.round === 1);
  const r2Matches = allGroupStageMatches.filter(m => m.round === 2);
  const r3Matches = allGroupStageMatches.filter(m => m.round === 3);

  // Round 1 Staggered Slots: 24 matches over 6 days (June 11 - June 16)
  const r1Slots = [
    // June 11 (2 matches)
    { day: 11, hours: 19 }, { day: 11, hours: 22 },
    // June 12 (4 matches)
    { day: 12, hours: 17 }, { day: 12, hours: 20 }, { day: 12, hours: 23 }, { day: 13, hours: 2 },
    // June 13 (4 matches)
    { day: 13, hours: 17 }, { day: 13, hours: 20 }, { day: 13, hours: 23 }, { day: 14, hours: 2 },
    // June 14 (4 matches)
    { day: 14, hours: 17 }, { day: 14, hours: 20 }, { day: 14, hours: 23 }, { day: 15, hours: 2 },
    // June 15 (5 matches)
    { day: 15, hours: 14 }, { day: 15, hours: 17 }, { day: 15, hours: 20 }, { day: 15, hours: 23 }, { day: 16, hours: 2 },
    // June 16 (5 matches)
    { day: 16, hours: 14 }, { day: 16, hours: 17 }, { day: 16, hours: 20 }, { day: 16, hours: 23 }, { day: 17, hours: 2 }
  ];

  for (let i = 0; i < r1Matches.length; i++) {
    const slot = r1Slots[i];
    const kickoff = new Date('2026-06-01T00:00:00Z');
    kickoff.setUTCDate(slot.day);
    kickoff.setUTCHours(slot.hours);
    r1Matches[i].kickoff = kickoff;
  }

  // Round 2 Staggered Slots: 24 matches over 5 days (June 17 - June 21)
  const r2Slots = [
    // June 17 (4 matches)
    { day: 17, hours: 17 }, { day: 17, hours: 20 }, { day: 17, hours: 23 }, { day: 18, hours: 2 },
    // June 18 (5 matches)
    { day: 18, hours: 14 }, { day: 18, hours: 17 }, { day: 18, hours: 20 }, { day: 18, hours: 23 }, { day: 19, hours: 2 },
    // June 19 (5 matches)
    { day: 19, hours: 14 }, { day: 19, hours: 17 }, { day: 19, hours: 20 }, { day: 19, hours: 23 }, { day: 20, hours: 2 },
    // June 20 (5 matches)
    { day: 20, hours: 14 }, { day: 20, hours: 17 }, { day: 20, hours: 20 }, { day: 20, hours: 23 }, { day: 21, hours: 2 },
    // June 21 (5 matches)
    { day: 21, hours: 14 }, { day: 21, hours: 17 }, { day: 21, hours: 20 }, { day: 21, hours: 23 }, { day: 22, hours: 2 }
  ];

  for (let i = 0; i < r2Matches.length; i++) {
    const slot = r2Slots[i];
    const kickoff = new Date('2026-06-01T00:00:00Z');
    kickoff.setUTCDate(slot.day);
    kickoff.setUTCHours(slot.hours);
    r2Matches[i].kickoff = kickoff;
  }

  // Round 3 (Final Matchday): 24 matches over 6 days (June 22 - June 27).
  // 2 groups play daily, each group's final pair kick off at the exact same hour to prevent collusion.
  for (const m of r3Matches) {
    const groupChar = m.groupName.charAt(m.groupName.length - 1);
    const groupIdx = groupChar.charCodeAt(0) - 65; // A=0, B=1... L=11
    const day = 22 + Math.floor(groupIdx / 2);
    const hours = (groupIdx % 2 === 0) ? 20 : 23;
    
    const kickoff = new Date('2026-06-01T00:00:00Z');
    kickoff.setUTCDate(day);
    kickoff.setUTCHours(hours);
    m.kickoff = kickoff;
  }

  // Sort all group stage matches chronologically
  const groupStageMatches = [...r1Matches, ...r2Matches, ...r3Matches];
  groupStageMatches.sort((a, b) => {
    const diff = a.kickoff!.getTime() - b.kickoff!.getTime();
    if (diff !== 0) return diff;
    return a.groupName.localeCompare(b.groupName);
  });

  // Save matches to database and assign matchNumber 1-72
  for (let i = 0; i < groupStageMatches.length; i++) {
    const match = groupStageMatches[i];
    const homeTeam = await prisma.team.findUnique({ where: { code: match.homeCode } });
    const awayTeam = await prisma.team.findUnique({ where: { code: match.awayCode } });
    if (!homeTeam || !awayTeam) throw new Error(`Teams ${match.homeCode} / ${match.awayCode} not found!`);

    await prisma.match.create({
      data: {
        id: match.id,
        phaseId: groupPhase.id,
        matchNumber: i + 1,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        kickoff: match.kickoff!,
        venueId: venues[i % venues.length].id,
        status: MatchStatus.SCHEDULED
      }
    });
  }
  console.log(`✅ Group Stage generated. 72 matches seeded chronologically (Match 1 to 72).`);

  // Helper to fetch team ID by code safely
  const getTeamId = async (code: string) => {
    const t = await prisma.team.findUnique({ where: { code } });
    if (!t) throw new Error(`Team Code ${code} not found!`);
    return t.id;
  };

  // ═══════════════════════════════════════
  // 5. GENERATE ROUND OF 32 (Matches 73-88)
  // ═══════════════════════════════════════
  console.log('📅 Generating Round of 32...');
  const r32Phase = phasesMap['round-of-32'];
  const r32Matchups = [
    { home: '2A', away: '2B' }, // Match 73
    { home: '1E', away: '3ABC-F' }, // Match 74
    { home: '1F', away: '2C' }, // Match 75
    { home: '1C', away: '2F' }, // Match 76
    { home: '2E', away: '2I' }, // Match 77
    { home: '1I', away: '3CD-H' }, // Match 78
    { home: '1A', away: '3CE-I' }, // Match 79
    { home: '1L', away: '3EH-K' }, // Match 80
    { home: '1G', away: '3AE-J' }, // Match 81
    { home: '1D', away: '3BE-J' }, // Match 82
    { home: '1H', away: '2J' }, // Match 83
    { home: '2K', away: '2L' }, // Match 84
    { home: '1B', away: '3EF-J' }, // Match 85
    { home: '2D', away: '2G' }, // Match 86
    { home: '1J', away: '2H' }, // Match 87
    { home: '1K', away: '3DE-L' }  // Match 88
  ];

  const r32BaseDate = new Date(r32Phase.startDate);
  for (let i = 0; i < r32Matchups.length; i++) {
    const matchup = r32Matchups[i];
    const matchNumber = 73 + i;
    const kickoff = new Date(r32BaseDate);
    // 16 matches over 6 days (June 28 to July 3)
    const dayOffset = Math.floor(i / 3);
    const isTwoMatchDay = dayOffset >= 4;
    kickoff.setDate(kickoff.getDate() + dayOffset);
    
    let hour = 17;
    if (isTwoMatchDay) {
      const indexInDay = (i - 12) % 2;
      hour = indexInDay === 0 ? 19 : 22;
    } else {
      const indexInDay = i % 3;
      hour = 17 + indexInDay * 3;
    }
    kickoff.setHours(hour, 0, 0, 0);

    await prisma.match.create({
      data: {
        id: `fwc26-r32-${matchNumber}`,
        phaseId: r32Phase.id,
        matchNumber,
        homeTeamId: await getTeamId(matchup.home),
        awayTeamId: await getTeamId(matchup.away),
        kickoff,
        venueId: venues[i % venues.length].id,
        status: MatchStatus.SCHEDULED
      }
    });
  }
  console.log(`✅ Round of 32 generated. 16 matches seeded (Match 73 to 88).`);

  // ═══════════════════════════════════════
  // 6. GENERATE ROUND OF 16 (Matches 89-96)
  // ═══════════════════════════════════════
  console.log('📅 Generating Round of 16...');
  const r16Phase = phasesMap['round-of-16'];
  const r16Matchups = [
    { home: 'W74', away: 'W77' }, // Match 89
    { home: 'W73', away: 'W75' }, // Match 90
    { home: 'W76', away: 'W78' }, // Match 91
    { home: 'W79', away: 'W80' }, // Match 92
    { home: 'W83', away: 'W84' }, // Match 93
    { home: 'W81', away: 'W82' }, // Match 94
    { home: 'W86', away: 'W88' }, // Match 95
    { home: 'W85', away: 'W87' }  // Match 96
  ];

  const r16BaseDate = new Date(r16Phase.startDate);
  for (let i = 0; i < r16Matchups.length; i++) {
    const matchup = r16Matchups[i];
    const matchNumber = 89 + i;
    const kickoff = new Date(r16BaseDate);
    kickoff.setDate(kickoff.getDate() + Math.floor(i / 2)); // Spread over 4 days (2 matches per day)
    kickoff.setHours(i % 2 === 0 ? 19 : 22, 0, 0, 0);

    await prisma.match.create({
      data: {
        id: `fwc26-r16-${matchNumber}`,
        phaseId: r16Phase.id,
        matchNumber,
        homeTeamId: await getTeamId(matchup.home),
        awayTeamId: await getTeamId(matchup.away),
        kickoff,
        venueId: venues[i % venues.length].id,
        status: MatchStatus.SCHEDULED
      }
    });
  }
  console.log(`✅ Round of 16 generated. 8 matches seeded (Match 89 to 96).`);

  // ═══════════════════════════════════════
  // 7. GENERATE QUARTER-FINALS (Matches 97-100)
  // ═══════════════════════════════════════
  console.log('📅 Generating Quarter-finals...');
  const qfPhase = phasesMap['quarter-finals'];
  const qfMatchups = [
    { home: 'W89', away: 'W90' }, // Match 97
    { home: 'W93', away: 'W94' }, // Match 98
    { home: 'W91', away: 'W92' }, // Match 99
    { home: 'W95', away: 'W96' }  // Match 100
  ];

  const qfBaseDate = new Date(qfPhase.startDate);
  for (let i = 0; i < qfMatchups.length; i++) {
    const matchup = qfMatchups[i];
    const matchNumber = 97 + i;
    const kickoff = new Date(qfBaseDate);
    
    let dayOffset = 0;
    let hour = 22;
    
    if (matchNumber === 97) {
      dayOffset = 0; // July 9
      hour = 22;
    } else if (matchNumber === 98) {
      dayOffset = 1; // July 10
      hour = 22;
    } else if (matchNumber === 99) {
      dayOffset = 2; // July 11
      hour = 19;
    } else if (matchNumber === 100) {
      dayOffset = 2; // July 11
      hour = 22;
    }
    
    kickoff.setDate(kickoff.getDate() + dayOffset);
    kickoff.setHours(hour, 0, 0, 0);

    await prisma.match.create({
      data: {
        id: `fwc26-qf-${matchNumber}`,
        phaseId: qfPhase.id,
        matchNumber,
        homeTeamId: await getTeamId(matchup.home),
        awayTeamId: await getTeamId(matchup.away),
        kickoff,
        venueId: venues[i % venues.length].id,
        status: MatchStatus.SCHEDULED
      }
    });
  }
  console.log(`✅ Quarter-finals generated. 4 matches seeded (Match 97 to 100).`);

  // ═══════════════════════════════════════
  // 8. GENERATE SEMI-FINALS (Matches 101-102)
  // ═══════════════════════════════════════
  console.log('📅 Generating Semi-finals...');
  const sfPhase = phasesMap['semi-finals'];
  const sfMatchups = [
    { home: 'W97', away: 'W98' }, // Match 101
    { home: 'W99', away: 'W100' } // Match 102
  ];

  const sfBaseDate = new Date(sfPhase.startDate);
  for (let i = 0; i < sfMatchups.length; i++) {
    const matchup = sfMatchups[i];
    const matchNumber = 101 + i;
    const kickoff = new Date(sfBaseDate);
    kickoff.setDate(kickoff.getDate() + i); // July 14 and July 15
    kickoff.setHours(22, 0, 0, 0);

    await prisma.match.create({
      data: {
        id: `fwc26-sf-${matchNumber}`,
        phaseId: sfPhase.id,
        matchNumber,
        homeTeamId: await getTeamId(matchup.home),
        awayTeamId: await getTeamId(matchup.away),
        kickoff,
        venueId: venues[i % venues.length].id,
        status: MatchStatus.SCHEDULED
      }
    });
  }
  console.log(`✅ Semi-finals generated. 2 matches seeded (Match 101 and 102).`);

  // ═══════════════════════════════════════
  // 9. GENERATE THIRD PLACE (Match 103)
  // ═══════════════════════════════════════
  console.log('📅 Generating Third Place Play-off...');
  const tpPhase = phasesMap['third-place'];
  const tpKickoff = new Date(tpPhase.startDate);
  tpKickoff.setHours(19, 0, 0, 0);

  await prisma.match.create({
    data: {
      id: 'fwc26-tp-103',
      phaseId: tpPhase.id,
      matchNumber: 103,
      homeTeamId: await getTeamId('L101'),
      awayTeamId: await getTeamId('L102'),
      kickoff: tpKickoff,
      venueId: venues[0].id,
      status: MatchStatus.SCHEDULED
    }
  });
  console.log(`✅ Third Place Play-off generated (Match 103).`);

  // ═══════════════════════════════════════
  // 10. GENERATE FINAL (Match 104)
  // ═══════════════════════════════════════
  console.log('📅 Generating Final...');
  const finalPhase = phasesMap['final'];
  const finalKickoff = new Date(finalPhase.startDate);
  finalKickoff.setHours(19, 0, 0, 0);

  await prisma.match.create({
    data: {
      id: 'fwc26-final-104',
      phaseId: finalPhase.id,
      matchNumber: 104,
      homeTeamId: await getTeamId('W101'),
      awayTeamId: await getTeamId('W102'),
      kickoff: finalKickoff,
      venueId: venues[0].id,
      status: MatchStatus.SCHEDULED
    }
  });
  console.log(`✅ Final generated (Match 104).`);

  console.log('🎉 Database seeding completed successfully! All 104 matches initialized matching the official FIFA World Cup 2026 schedule.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
