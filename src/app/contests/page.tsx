import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ContestCard } from '@/components/contests/ContestCard';
import type { Contest } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Contests Lobby',
  description: 'Join skill-based prediction contests and compete for SOL.',
};

export const revalidate = 30; // 30 sec revalidation

export default async function ContestsLobbyPage() {
  // Fetch active and upcoming contests
  const contests = await prisma.contest.findMany({
    where: {
      status: {
        in: ['UPCOMING', 'ACTIVE', 'REGISTRATION']
      }
    },
    orderBy: {
      startDate: 'asc'
    }
  });

  if (!contests || contests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gradient-gold mb-4">No Contests Available</h2>
        <p className="text-muted-foreground">Check back soon for new tournaments and match days.</p>
      </div>
    );
  }

  // Separate Grand Tournament from others
  const grandTournaments = contests.filter((c: Contest) => c.type === 'GRAND_TOURNAMENT');
  const otherContests = contests.filter((c: Contest) => c.type !== 'GRAND_TOURNAMENT');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-black mb-4">
          Contest <span className="text-gradient-gold">Lobby</span>
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl">
          Enter free or premium prediction pools using just your <strong className="text-foreground">Email</strong>, <strong className="text-foreground">Google</strong> account, or a Crypto Wallet. No crypto experience required!
        </p>
      </div>

      {/* Featured / Grand Tournaments */}
      {grandTournaments.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white/90 mb-6 flex items-center gap-2">
            <span className="text-gold">🏆</span> Featured Tournaments
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {grandTournaments.map((c: Contest) => (
              <ContestCard
                key={c.id}
                id={c.id}
                slug={c.slug}
                name={c.name}
                type={c.type}
                status={c.status}
                entryFeeSOL={c.entryFeeSOL}
                prizePool={c.prizePool}
                prizePoolPoolAmount={Number(c.prizePool) / 1000000000}
                currentEntries={c.currentEntries}
                maxParticipants={c.maxParticipants}
                startDate={c.startDate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Contests */}
      {otherContests.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white/90 mb-6">
            Daily & Phase Battles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {otherContests.map((c: Contest) => (
              <ContestCard
                key={c.id}
                id={c.id}
                slug={c.slug}
                name={c.name}
                type={c.type}
                status={c.status}
                entryFeeSOL={c.entryFeeSOL}
                prizePool={c.prizePool}
                prizePoolPoolAmount={Number(c.prizePool) / 1000000000}
                currentEntries={c.currentEntries}
                maxParticipants={c.maxParticipants}
                startDate={c.startDate}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
