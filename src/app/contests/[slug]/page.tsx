import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { PredictionForm } from '@/components/contests/PredictionForm';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { Trophy, Clock, Users, ArrowLeft, Key } from 'lucide-react';
import Link from 'next/link';
import { ShareButton } from '@/components/contests/ShareButton';

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

  // 5. Timelock Logic (Sync with Backend 10-minute rule)
  const earliestKickoff = matches.length > 0 
    ? Math.min(...matches.map(m => new Date(m.kickoff).getTime())) 
    : Infinity;
  
  const now = Date.now();
  const BUFFER_MS = 10 * 60 * 1000; // 10 minutes
  
  // A contest is locked if we are within 10 mins of kickoff OR if its status is advanced (Scoring, Finished, etc.)
  const isLockedByTime = now > (earliestKickoff - BUFFER_MS);
  const isLockedByStatus = !['UPCOMING', 'REGISTRATION', 'ACTIVE'].includes(contest.status);
  const isLocked = isLockedByTime || isLockedByStatus;

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

        <div className="relative z-10">
          {/* Corporate Branding if Private */}
          {contest.isPrivate && (
            <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 group">
               <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30 shadow-inner">
                  <img src={contest.customLogoUrl || '/branding/default-logo.png'} alt={contest.customBrandName || ''} className="h-full w-full object-cover" />
               </div>
               <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-80 mb-0.5">Corporate Battle Sponsored by</div>
                  <div className="text-xl font-black text-white">{contest.customBrandName}</div>
               </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {contest.isPrivate ? (
                  <span className="px-3 py-1 text-[10px] font-black bg-primary text-primary-foreground rounded-full border border-primary glow-green uppercase tracking-widest">
                    Private League
                  </span>
                ) : (
                  <span className={`px-3 py-1 text-xs font-bold rounded-md ${contest.entryFeeSOL > 0 ? 'bg-white/10 text-white' : 'bg-primary/20 text-primary'}`}>
                    {contest.entryFeeSOL > 0 ? `${contest.entryFeeSOL} SOL Entry` : 'FREE ENTRY'}
                  </span>
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{contest.status}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground drop-shadow-sm leading-tight text-white">
                {contest.name}
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                {contest.description || "Predict the match outcomes to earn points. Exact scores yield bonus points!"}
              </p>
            </div>

            <div className="flex gap-4 md:flex-col md:items-end md:gap-6 mt-4 md:mt-0">
              {contest.isPrivate ? (
                <div className="flex flex-col items-center md:items-end gap-3">
                   <div className="flex items-center gap-2 text-primary font-mono text-sm font-black border border-primary/20 px-4 py-2 rounded-xl bg-primary/5">
                      <Key className="w-3 h-3" /> {contest.inviteCode}
                   </div>
                   <ShareButton inviteCode={contest.inviteCode} contestName={contest.name} />
                </div>
              ) : (
                <div className="glass px-5 py-3 rounded-xl border border-gold/30 flex flex-col items-center md:items-end shadow-2xl">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1 shadow-sm">Prize Pool</span>
                  <div className="flex items-center gap-2 text-2xl md:text-3xl font-black text-gradient-gold">
                    <Trophy className="h-6 w-6 text-gold" /> {prizePool > 0 ? `${prizePool} SOL` : 'TBA'}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {contest.currentEntries} Entered</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {Math.max(0, matches.length)} Matches</span>
              </div>
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
            isLive={isLocked}
          />
        )}
      </div>

    </div>
  );
}
