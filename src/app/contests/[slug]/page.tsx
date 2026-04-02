import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { PredictionForm } from '@/components/contests/PredictionForm';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { Trophy, Clock, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const contest = await prisma.contest.findUnique({ where: { slug } });
  return {
    title: contest ? `${contest.name} | Predict & Win` : 'Contest Not Found',
  };
}

export default async function ContestDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Authenticate Request
  const cookieStore = await cookies();
  const token = cookieStore.get('scorendo_session')?.value;
  const session = token ? await verifySessionToken(token) : null;
  const userWallet = session?.wallet as string | undefined;

  // 2. Fetch Contest details
  const contest = await prisma.contest.findUnique({
    where: { slug },
    include: {
      phase: {
        include: {
          matches: {
            include: { homeTeam: true, awayTeam: true },
            orderBy: { kickoff: 'asc' }
          }
        }
      },
      tournament: {
        include: {
          phases: {
            include: {
              matches: {
                include: { homeTeam: true, awayTeam: true },
                orderBy: { kickoff: 'asc' }
              }
            }
          }
        }
      }
    }
  });

  if (!contest) notFound();

  // 3. Determine Mathes to Predict
  // If Contest is tied to a specific Phase, show only phase matches.
  // Otherwise, show tournament matches (up to a limit if GRAND_TOURNAMENT).
  let matches = contest.phase?.matches || [];
  if (matches.length === 0 && contest.tournament) {
    matches = contest.tournament.phases.flatMap((p: any) => p.matches);
  }

  // 4. Fetch User's existing predictions for this contest
  let existingPredictions: any[] = [];
  let userEntry = null;
  if (userWallet) {
    userEntry = await prisma.userContestEntry.findUnique({
      where: { userWallet_contestId: { userWallet, contestId: contest.id } }
    });
    existingPredictions = await prisma.prediction.findMany({
      where: { userWallet, contestId: contest.id }
    });
  }

  const isLive = contest.status !== 'UPCOMING' && contest.status !== 'REGISTRATION';
  const prizePool = Number(contest.prizePool) / 1_000_000_000;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
      
      {/* Back Link */}
      <Link href="/contests" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Lobby
      </Link>

      {/* Contest Header UI */}
      <div className="glass-strong rounded-3xl p-6 md:p-10 mb-10 border border-primary/20 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-md ${contest.entryFeeSOL > 0 ? 'bg-white/10 text-white' : 'bg-primary/20 text-primary'}`}>
                {contest.entryFeeSOL > 0 ? `${contest.entryFeeSOL} SOL Entry` : 'FREE ENTRY'}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{contest.status}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground drop-shadow-sm leading-tight">
              {contest.name}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              {contest.description || "Predict the match outcomes to earn points. Exact scores yield bonus points!"}
            </p>
          </div>

          <div className="flex gap-4 md:flex-col md:items-end md:gap-6 mt-4 md:mt-0">
            <div className="glass px-5 py-3 rounded-xl border border-gold/30 flex flex-col items-center md:items-end">
              <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1 shadow-sm">Prize Pool</span>
              <div className="flex items-center gap-2 text-2xl md:text-3xl font-black text-gradient-gold">
                <Trophy className="h-6 w-6 text-gold" /> {prizePool > 0 ? `${prizePool} SOL` : 'TBA'}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {contest.currentEntries} Entered</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {Math.max(0, matches.length)} Matches</span>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-white">
          <span className="text-primary">●</span> Match Predictions
        </h2>

        {!userWallet ? (
          <div className="glass p-12 rounded-2xl text-center border border-border/30 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <h3 className="text-xl font-bold mb-3 text-white">Authentication Required</h3>
            <p className="text-muted-foreground mb-6">You must verify your identity to make predictions for this contest.</p>
            <p className="text-sm text-primary font-bold bg-primary/10 inline-block px-4 py-2 rounded-lg border border-primary/20">
              Please click the <span className="text-white">Secure Entry</span> button in the top right header to finalize your session ↑
            </p>
          </div>
        ) : (
          <PredictionForm 
            contestId={contest.id}
            matches={matches} 
            existingPredictions={existingPredictions}
            isLive={isLive}
          />
        )}
      </div>

    </div>
  );
}
