import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { MatchCard } from '@/components/matches/MatchCard';
import { MatchStatus, PredictionOutcome } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Matches Schedule',
  description: 'View the official World Cup 2026 match schedule and live scores.',
};

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function MatchesPage() {
  // Fetch matches ordered by kickoff time, including related entities
  const matches = await prisma.match.findMany({
    orderBy: { kickoff: 'asc' },
    include: {
      homeTeam: true,
      awayTeam: true,
      venue: true,
      phase: true,
    },
  });

  if (!matches || matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gradient-pitch mb-4">No Matches Found</h2>
        <p className="text-muted-foreground">The tournament schedule has not been synced yet.</p>
      </div>
    );
  }

  // Generate Match Days
  const scheduleGroups = matches.reduce((acc, match) => {
    const dateStr = match.kickoff.toISOString().split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  // Sort dates
  const sortedDates = Object.keys(scheduleGroups).sort();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 lg:py-20">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-black mb-3">
          Tournament <span className="text-gradient-pitch">Schedule</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Track official match schedules, live scores, and venue allocations.
        </p>
      </div>

      {/* Roster Layout */}
      <div className="space-y-12">
        {sortedDates.map((dateStr) => {
          const dateMatches = scheduleGroups[dateStr];
          const displayDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          }).format(new Date(dateStr));
          
          return (
            <div key={dateStr} className="relative">
              {/* Date Header string */}
              <div className="sticky top-16 z-10 glass-strong rounded-xl px-4 py-2 border-l-4 border-l-primary mb-6 flex items-center shadow-md">
                <h3 className="text-lg font-bold">{displayDate}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 relative z-0">
                {dateMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    matchNumber={match.matchNumber}
                    homeTeam={{ name: match.homeTeam.name, code: match.homeTeam.code }}
                    awayTeam={{ name: match.awayTeam.name, code: match.awayTeam.code }}
                    kickoff={match.kickoff}
                    status={match.status as MatchStatus}
                    homeScore={match.homeScore}
                    awayScore={match.awayScore}
                    venueName={match.venue?.name}
                    phaseName={match.phase.name}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
