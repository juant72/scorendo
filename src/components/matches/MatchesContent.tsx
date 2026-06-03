'use client';

import React from 'react';
import { MatchCard } from '@/components/matches/MatchCard';
import { MatchStatus } from '@prisma/client';
import { useAuthStore } from '@/store/useAuthStore';

interface MatchesContentProps {
  initialMatches: any[];
}

export function MatchesContent({ initialMatches }: MatchesContentProps) {
  const { locale } = useAuthStore();

  // Group matches by date
  const scheduleGroups = initialMatches.reduce((acc, match) => {
    // Parse kickoff date to ISO date string (YYYY-MM-DD)
    const dateStr = new Date(match.kickoff).toISOString().split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(match);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort dates
  const sortedDates = Object.keys(scheduleGroups).sort();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 lg:py-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-black mb-3">
          {locale === 'es' ? 'Calendario de ' : 'Tournament '}
          <span className="text-gradient-pitch">{locale === 'es' ? 'Partidos' : 'Schedule'}</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {locale === 'es' 
            ? 'Sigue el fixture oficial, resultados en vivo y asignación de sedes.' 
            : 'Track official match schedules, live scores, and venue allocations.'}
        </p>
      </div>

      {/* Roster Layout */}
      <div className="space-y-12">
        {sortedDates.map((dateStr) => {
          const dateMatches = scheduleGroups[dateStr];
          const displayDate = new Intl.DateTimeFormat(locale === 'es' ? 'es-AR' : 'en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          }).format(new Date(dateStr));
          
          return (
            <div key={dateStr} className="relative">
              {/* Date Header string */}
              <div className="sticky top-16 z-10 glass-strong rounded-xl px-4 py-2 border-l-4 border-l-primary mb-6 flex items-center shadow-md">
                <h3 className="text-lg font-bold capitalize">{displayDate}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 relative z-0">
                {dateMatches.map((match: any) => (
                  <MatchCard
                    key={match.id}
                    matchId={match.id}
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
