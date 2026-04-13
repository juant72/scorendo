import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { Trophy, Clock, Users, ArrowLeft, Key, Share2, Shield, Activity, Zap } from 'lucide-react';
import { ShareButton } from '@/components/contests/ShareButton';
import { ContestPredictionHub } from '@/components/contests/ContestPredictionHub';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getArenaImagery } from '@/lib/graphics';

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
          competition: {
             include: { sport: true }
          },
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

  // Arena Imagery Logic (V2 Implementation)
  const imagery = getArenaImagery(contest);

  // 3. Determine Matches to Predict
  let matches = contest.phase?.matches || [];
  if (matches.length === 0 && contest.tournament) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matches = contest.tournament.phases.flatMap((p: any) => p.matches);
  }

  // 4. Fetch User Data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let existingPredictions: any[] = [];
  let userEntry = null;
  let userData = null;

  if (userWallet) {
    [userEntry, userData, existingPredictions] = await Promise.all([
      prisma.userContestEntry.findUnique({
        where: { userWallet_contestId: { userWallet, contestId: contest.id } }
      }),
      prisma.user.findUnique({
        where: { walletAddress: userWallet as string }
      }),
      prisma.prediction.findMany({
        where: { userWallet, contestId: contest.id }
      })
    ]);
  }

  // 5. Timelock Logic
  const earliestKickoff = matches.length > 0 
    ? Math.min(...matches.map(m => new Date(m.kickoff).getTime())) 
    : Infinity;
  
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const BUFFER_MS = 10 * 60 * 1000;
  const isLockedByTime = now > (earliestKickoff - BUFFER_MS);
  const isLockedByStatus = !['UPCOMING', 'REGISTRATION', 'ACTIVE'].includes(contest.status);
  const isLocked = isLockedByTime || isLockedByStatus;

  const prizePool = Number(contest.prizePool) / 1_000_000_000;
  const entryFee = Number(contest.entryFeeSOL) / 1_000_000_000;

  return (
    <div className="min-h-screen bg-[#020814]">
      
      {/* ── ARENA HERO SECTION ── */}
      <div className="relative h-[350px] lg:h-[420px] flex flex-col justify-end overflow-hidden">
         {/* Adaptive Backdrop */}
         <div className="absolute inset-0">
            <img src={imagery.banner} className="w-full h-full object-cover opacity-60" alt="Backdrop" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020814] via-[#020814]/40 to-transparent" />
         </div>

         <div className="container mx-auto px-4 relative z-10 pb-12">
            <Breadcrumbs items={[
               { label: 'Arenas', href: '/contests' },
               { label: contest.tournament?.name || 'League', href: `/contests?sport=${contest.tournament?.competition?.sport?.slug}` },
               { label: contest.name }
            ]} />

            <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
               <div className="space-y-6 max-w-3xl">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-white/5 backdrop-blur-2xl rounded-xl border border-white/10 shadow-lg">
                        <img src={imagery.badge} className="w-8 h-8 object-contain" alt="Badge" />
                     </div>
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${imagery.accent}`}>{contest.tournament?.name}</span>
                           <div className="w-1 h-1 rounded-full bg-white/20" />
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{contest.status}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight leading-none text-white">
                           {contest.name}
                        </h1>
                     </div>
                  </div>
               </div>

               {/* Quick Info Bar */}
               <div className="flex flex-wrap items-center gap-4">
                  <StatItem icon={<Trophy className="text-gold" />} label="Prize Fund" value={prizePool > 0 ? `${prizePool} SOL` : 'TBA'} primary />
                  <StatItem icon={<Key className="text-primary" />} label="Entry Fee" value={entryFee === 0 ? 'FREE' : `${entryFee} SOL`} />
                  <StatItem icon={<Users className="text-white/40" />} label="Entries" value={contest.currentEntries} />
               </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-16">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Predictions Area (Main Segment) */}
            <div className="lg:col-span-8 space-y-12">
               <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="space-y-1">
                     <h2 className="text-2xl font-black uppercase italic text-white flex items-center gap-3">
                       <Zap size={20} className="text-primary" /> Tactical <span className="text-primary">Board</span>
                    </h2>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Deploy your match predictions below</p>
                  </div>
                  {contest.inviteCode && (
                     <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-primary/40 uppercase tracking-widest border border-primary/10 px-4 py-2 rounded-xl bg-primary/5">
                           <Key size={12} /> {contest.inviteCode}
                        </div>
                        <ShareButton inviteCode={contest.inviteCode} contestName={contest.name} />
                     </div>
                  )}
               </div>

               {!userWallet ? (
                 <div className="glass-premium p-16 rounded-[3rem] text-center border-white/5 shadow-3xl">
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
                      <Shield className="text-primary" size={32} />
                   </div>
                    <h3 className="text-2xl font-black mb-4 text-white uppercase italic">Connect To Play</h3>
                   <p className="text-sm text-white/40 mb-10 italic max-w-sm mx-auto leading-relaxed">Verification of wallet identity is mandatory for Arena entry. High-clearance session required.</p>
                   <div className="h-14 px-10 bg-primary text-midnight font-black text-xs uppercase tracking-widest rounded-xl inline-flex items-center justify-center shadow-2xl shadow-primary/20">
                      Secure Terminal Entry
                   </div>
                 </div>
               ) : (
                 <ContestPredictionHub 
                   contestId={contest.id}
                   matches={matches} 
                   existingPredictions={existingPredictions}
                   isLocked={isLocked}
                   isEntered={!!userEntry}
                   entryFeeSOL={contest.entryFeeSOL}
                   userWallet={userWallet}
                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   userName={(userData as any)?.displayName || userWallet}
                 />
               )}
            </div>

            {/* Sidebar (Pragmatic Context) */}
            <div className="lg:col-span-4 space-y-12">
               <div className="glass-premium p-10 rounded-[2.5rem] border-white/5 space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 border-b border-white/5 pb-4">Arena Intel</h4>
                  <div className="space-y-6">
                     <p className="text-sm text-white/60 italic leading-relaxed">
                        {contest.description || "Predict outcomes to accumulate points. Precise results grant maximum dominance rewards."}
                     </p>
                     
                     <div className="p-6 bg-white/2 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className="text-white/40">Scoring Protocol</span>
                           <span className="text-primary">V4.2</span>
                        </div>
                        <ul className="space-y-3 text-[9px] font-black text-white/20 uppercase tracking-widest">
                           <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Exact Score: 100 PTS</li>
                           <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/10" /> Goal Diff: 50 PTS</li>
                           <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/10" /> Outcome: 30 PTS</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value, primary }: { icon: React.ReactNode, label: string, value: string | number, primary?: boolean }) {
   return (
      <div className={`px-6 py-4 rounded-2xl border backdrop-blur-xl flex flex-col items-center sm:items-start min-w-[140px] ${primary ? 'bg-primary/5 border-primary/20 shadow-xl' : 'bg-white/5 border-white/10'}`}>
         <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{label}</span>
         <div className="flex items-center gap-2">
            {icon}
            <span className={`text-xl font-black italic tracking-tighter ${primary ? 'text-white' : 'text-white/80'}`}>{value}</span>
         </div>
      </div>
   );
}
