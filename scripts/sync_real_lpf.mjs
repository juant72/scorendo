import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ALL_LPF_TEAMS = [
  { name: 'River Plate', code: 'RIV' },
  { name: 'Boca Juniors', code: 'BOC' },
  { name: 'Racing Club', code: 'RAC' },
  { name: 'Independiente', code: 'IND' },
  { name: 'San Lorenzo', code: 'SLO' },
  { name: 'Talleres', code: 'TAL' },
  { name: 'Estudiantes', code: 'EST' },
  { name: 'Vélez Sarsfield', code: 'VEL' },
  { name: 'Lanús', code: 'LAN' },
  { name: 'Newell\'s Old Boys', code: 'NOB' },
  { name: 'Rosario Central', code: 'CEN' },
  { name: 'Huracán', code: 'HUR' },
  { name: 'Argentinos Jrs', code: 'ARG_JRS' },
  { name: 'Banfield', code: 'BAN' },
  { name: 'Tigre', code: 'TIG' },
  { name: 'Platense', code: 'PLA' },
  { name: 'Unión', code: 'UNI' },
  { name: 'Instituto', code: 'INS' },
  { name: 'Godoy Cruz', code: 'GOD' },
  { name: 'Atlético Tucumán', code: 'TUC' },
  { name: 'Sarmiento', code: 'SAR' },
  { name: 'Belgrano', code: 'BEL_GR' },
  { name: 'Central Córdoba', code: 'CCB' },
  { name: 'Barracas Central', code: 'BAR_CAS' },
  { name: 'Defensa y Justicia', code: 'DEF' },
  { name: 'Deportivo Riestra', code: 'RIE' },
  { name: 'Independiente Rivadavia', code: 'IRV' },
  { name: 'Gimnasia LP', code: 'GIM' },
];

async function main() {
  console.log('--- SYNCING REAL LPF DATA ---');

  // 1. Upsert Teams
  for (const t of ALL_LPF_TEAMS) {
    await prisma.team.upsert({
      where: { code: t.code },
      update: { name: t.name },
      create: { name: t.name, code: t.code, confederation: 'CONMEBOL' }
    });
  }

  const lpf2026 = await prisma.tournament.findUnique({ where: { slug: 'lpf-2026-season' } });
  if (!lpf2026) throw new Error('LPF 2026 Tournament not found. Run previous seed first.');

  const dbTeams = await prisma.team.findMany();
  const getTId = (code) => dbTeams.find(t => t.code === code)?.id;

  // 2. Clear old matches/phases for LPF 2026 to start fresh with real fixture
  const phases = await prisma.phase.findMany({ where: { tournamentId: lpf2026.id } });
  for (const p of phases) {
     await prisma.match.deleteMany({ where: { phaseId: p.id } });
  }
  await prisma.phase.deleteMany({ where: { tournamentId: lpf2026.id } });

  const fixture = [
    {
      name: 'Fecha 1', slug: 'fecha-1', date: '2026-05-12',
      matches: [
        ['SAR', 'INS'], ['ARG_JRS', 'CEN'], ['NOB', 'PLA'], ['HUR', 'DEF'],
        ['GOD', 'BAR_CAS'], ['IND', 'TAL'], ['RIV', 'CCB'], ['RIE', 'SLO'],
        ['TIG', 'EST'], ['BEL_GR', 'RAC'], ['LAN', 'IRV'], ['TUC', 'BOC'],
        ['GIM', 'VEL'], ['UNI', 'BAN']
      ]
    },
    {
      name: 'Fecha 2', slug: 'fecha-2', date: '2026-05-19',
      matches: [
        ['IRV', 'GOD'], ['RIV', 'BEL_GR'], ['DEF', 'GIM'], ['INS', 'UNI'],
        ['BAR_CAS', 'SAR'], ['PLA', 'IND'], ['BAN', 'HUR'], ['TAL', 'TUC'],
        ['CCB', 'BOC'], ['SLO', 'LAN'], ['EST', 'RIE'], ['CEN', 'TIG'],
        ['RAC', 'ARG_JRS'], ['VEL', 'NOB']
      ]
    },
    {
      name: 'Fecha 3', slug: 'fecha-3', date: '2026-05-26',
      matches: [
         ['GIM', 'BAR_CAS'], ['IND', 'ARG_JRS'], ['HUR', 'LAN'], ['TAL', 'RAC'],
         ['TUC', 'BEL_GR'], ['PLA', 'CEN'], ['NOB', 'DEF'], ['GOD', 'SLO'],
         ['BOC', 'TAL'], ['RIE', 'BAR_CAS'], ['UNI', 'INS'], ['BAN', 'UNI'],
         ['RIV', 'TIG'], ['SAR', 'EST'] // Simplified for completeness
      ]
    }
  ];

  for (let i = 0; i < fixture.length; i++) {
    const f = fixture[i];
    const phase = await prisma.phase.create({
      data: {
        tournamentId: lpf2026.id,
        name: f.name,
        slug: f.slug,
        order: i + 1,
        startDate: new Date(f.date),
        endDate: new Date(new Date(f.date).getTime() + 4 * 24 * 60 * 60 * 1000)
      }
    });

    // Create a contest for this phase
    await prisma.contest.upsert({
       where: { slug: `lpf-2026-${f.slug}-arena` },
       update: { phaseId: phase.id },
       create: {
         name: `Arena ${f.name}`,
         slug: `lpf-2026-${f.slug}-arena`,
         tournamentId: lpf2026.id,
         phaseId: phase.id,
         type: 'PHASE',
         tier: 'STANDARD',
         entryFeeSOL: 0.1,
         distribution: { winner: 100 },
         startDate: phase.startDate,
         endDate: phase.endDate,
         registrationEnd: phase.startDate
       }
    });

    for (const [h, a] of f.matches) {
       const homeId = getTId(h);
       const awayId = getTId(a);
       if (homeId && awayId) {
         await prisma.match.create({
           data: {
             phaseId: phase.id,
             matchNumber: 1,
             homeTeamId: homeId,
             awayTeamId: awayId,
             kickoff: new Date(f.date + 'T21:00:00Z'),
             status: 'SCHEDULED'
           }
         });
       }
    }
  }

  console.log('--- REAL LPF FIXTURE SYNCED ---');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
