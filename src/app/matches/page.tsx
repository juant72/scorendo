import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { MatchesContent } from '@/components/matches/MatchesContent';

export const metadata: Metadata = {
  title: 'Matches Schedule',
  description: 'View the official World Cup 2026 match schedule and live scores.',
};

export const dynamic = 'force-dynamic';

export default async function MatchesPage() {
  // Fetch matches ordered by kickoff time, including related entities
  const matches = await prisma.match.findMany({
    where: {
      phase: {
        tournament: {
          slug: 'fifa-world-cup-2026'
        }
      }
    },
    orderBy: { kickoff: 'asc' },
    include: {
      homeTeam: true,
      awayTeam: true,
      venue: true,
      phase: true,
    },
  });

  // Serialize dates and bigints to prevent Next.js serialization warnings
  const serializedMatches = JSON.parse(JSON.stringify(matches));

  return <MatchesContent initialMatches={serializedMatches} />;
}
