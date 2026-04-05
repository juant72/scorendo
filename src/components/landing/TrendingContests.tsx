import { prisma } from '@/lib/prisma';
import { ContestStatus, ContestType } from '@prisma/client';
import { Trophy, Users, Coins, ArrowRight, Activity, Zap } from 'lucide-react';
import Link from 'next/link';
import { formatDateShort } from '@/lib/utils';

export async function TrendingContests({ sport }: { sport?: string }) {
  try {
    const contests = await prisma.contest.findMany({
      where: {
        isPrivate: false,
        status: {
          in: [ContestStatus.UPCOMING, ContestStatus.REGISTRATION, ContestStatus.ACTIVE]
        },
        ...(sport ? {
          tournament: {
            competition: {
              sport: {
                slug: sport
              }
            }
          }
        } : {})
      },
      take: 6,
      orderBy: {
        startDate: 'asc'
      },
      include: {
        _count: {
          select: { entries: true }
        },
        tournament: {
          include: {
            competition: {
              include: {
                sport: true
              }
            }
          }
        }
      }
    });

    if (contests.length === 0) return null;

    return (
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-8 bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Live Arenas</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
                Most Played <span className="text-primary">& Recent</span>
              </h2>
            </div>
            <Link href="/contests" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
              View All Tournaments <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => {
              const sport = contest.tournament?.competition?.sport;
              const sportSlug = sport?.slug || 'general';
              const sportName = sport?.name || 'Arena';
              const lowercaseName = contest.name.toLowerCase();
              const formattedPrize = Number(contest.prizePool) / 1e9;
              const formattedEntry = Number(contest.entryFeeSOL) / 1e9;

              // Arena Allegory Mapping (100% Local Reliability)
              let backgroundImage = contest.customLogoUrl;

              if (!backgroundImage) {
                const isF1 = lowercaseName.includes('f1') || lowercaseName.includes('formula') || lowercaseName.includes('prix') || lowercaseName.includes('race') || sportSlug.includes('motor') || sportSlug.includes('auto');
                const isFootball = lowercaseName.includes('uefa') || lowercaseName.includes('champions') || lowercaseName.includes('afa') || lowercaseName.includes('lpf') || lowercaseName.includes('argentina') || sportSlug.includes('foot') || sportSlug.includes('fútbol');
                const isNBA = lowercaseName.includes('nba') || lowercaseName.includes('basket') || sportSlug.includes('nba') || sportSlug.includes('basket');

                if (lowercaseName.includes('monaco')) {
                   backgroundImage = '/arenas/monaco.png';
                } else if (isF1) {
                   backgroundImage = '/arenas/f1_championship.png'; 
                } else if (lowercaseName.includes('uefa') || lowercaseName.includes('champions')) {
                   backgroundImage = '/arenas/uefa.png';
                } else if (isFootball) {
                   backgroundImage = '/arenas/afa_lpf.png'; // Local Passion Art
                } else if (isNBA) {
                   backgroundImage = 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2000&auto=format&fit=crop'; 
                } else {
                   // Universal Local Fallback: No more dark cards
                   backgroundImage = '/arenas/general_arena.png';
                }
              }

              return (
                <Link key={contest.id} href={`/contests/${contest.slug}`}>
                  <div className="group relative glass-premium rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-2 shadow-2xl overflow-hidden flex flex-col h-[420px]">
                    
                    {/* Background Image Layer */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={backgroundImage} 
                        alt={contest.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent opacity-90" />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 p-8 flex flex-col h-full">
                      {/* Top Row: Sport Badge & Status */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                          <Activity className="w-3 h-3 text-primary" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-white">{sportName}</span>
                        </div>
                        
                        {contest.status === ContestStatus.ACTIVE ? (
                          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-[8px] font-black uppercase animate-pulse">
                            <span className="w-1 h-1 rounded-full bg-primary" /> LIVE
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                            {formatDateShort(contest.startDate)}
                          </span>
                        )}
                      </div>

                      {/* Title & Type */}
                      <div className="mb-8">
                         <div className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-2 opacity-90">
                            {contest.type?.replace('_', ' ') || 'TOURNAMENT'}
                         </div>
                         <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-8 group-hover:text-primary transition-colors line-clamp-2 drop-shadow-lg">
                            {contest.name}
                         </h3>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-6 mb-8 pt-6 border-t border-white/10 mt-auto">
                         <div className="space-y-2">
                            <span className="block text-[8px] font-black text-white/40 uppercase tracking-widest">Prize Pool</span>
                            <div className="flex items-center gap-2">
                               <Trophy className="w-4 h-4 text-gold flex-shrink-0" />
                               <span className="text-base font-black text-white italic truncate">
                                  {formattedPrize > 0 ? `${formattedPrize.toLocaleString()} SOL` : 'TBA'}
                                </span>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <span className="block text-[8px] font-black text-white/40 uppercase tracking-widest">Participants</span>
                            <div className="flex items-center gap-2">
                               <Users className="w-4 h-4 text-primary flex-shrink-0" />
                               <span className="text-base font-black text-white tabular-nums">
                                  {contest._count?.entries || 0} <span className="text-[10px] text-white/30">/ {contest.maxParticipants || '∞'}</span>
                               </span>
                            </div>
                         </div>
                      </div>

                      {/* Footer Row */}
                      <div className="flex items-center justify-between mt-4">
                         <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors backdrop-blur-md">
                            <Coins className="w-4 h-4 text-primary" />
                            <span className="text-xs font-black text-white">
                               {formattedEntry === 0 ? 'FREE ENTRY' : `${formattedEntry} SOL`}
                            </span>
                         </div>

                         <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-midnight transition-all group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                            <ArrowRight className="w-5 h-5" />
                         </div>
                      </div>
                    </div>

                    {/* Decorative Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  </div>
                </Link>
              );
            })}


          </div>
        </div>
      </section>

    );
  } catch (error) {
    console.error('Arena Data Error:', error);
    return null;
  }
}

