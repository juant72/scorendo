import { prisma } from '@/lib/prisma';
import { ContestStatus } from '@prisma/client';
import { Trophy, Users, Coins, ArrowRight, Activity, Zap, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDateShort } from '@/lib/utils';
import { getArenaImagery } from '@/lib/graphics';

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
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Pragmatic Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Live Markets</span>
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                Featured <span className="text-primary">Arenas</span>
              </h2>
            </div>
            <Link href="/contests" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors flex items-center gap-2 pb-1">
              Browse All Leagues <ArrowRight size={14} />
            </Link>
          </div>

          {/* Pragmatic Grid: Smaller, more functional cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => {
              const imagery = getArenaImagery(contest);
              const formattedPrize = Number(contest.prizePool) / 1e9;
              const formattedEntry = Number(contest.entryFeeSOL) / 1e9;
              const sportName = contest.tournament?.competition?.sport?.name || 'Sport';

              return (
                <Link key={contest.id} href={`/contests/${contest.slug}`}>
                  <div className="group relative glass-premium rounded-3xl border border-white/5 hover:border-primary/40 transition-all hover:-translate-y-1 shadow-xl overflow-hidden flex flex-col h-[320px]">
                    
                    {/* Background Layer (Pragmatic Overlay) */}
                    <div className="absolute inset-x-0 top-0 h-40 z-0">
                      <img 
                        src={imagery.banner} 
                        alt={contest.name} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/60 to-transparent" />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 p-6 flex flex-col h-full">
                      {/* Top Sport Pill */}
                      <div className="flex justify-between items-start mb-16">
                         <div className={`px-2 py-1 rounded-lg border bg-black/40 backdrop-blur-md flex items-center gap-1.5 border-white/10 ${imagery.accent}`}>
                            <Activity size={10} />
                            <span className="text-[8px] font-black uppercase tracking-widest">{sportName}</span>
                         </div>
                         {contest.status === ContestStatus.ACTIVE && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[8px] font-black uppercase">
                               <div className="w-1 h-1 rounded-full bg-primary animate-pulse" /> LIVE
                            </div>
                         )}
                      </div>

                      {/* Title Section */}
                      <div className="mb-4">
                         <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {contest.name}
                         </h3>
                         <div className="flex items-center gap-2 mt-2 opacity-40">
                            <Clock size={10} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{formatDateShort(contest.startDate)}</span>
                         </div>
                      </div>

                      {/* Stats Hub (Pragmatic Layout) */}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Prize Pool</span>
                            <span className="text-sm font-black text-white italic">{formattedPrize > 0 ? `${formattedPrize} SOL` : 'TBA'}</span>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Entry</span>
                            <span className="text-sm font-black text-primary">{formattedEntry === 0 ? 'FREE' : `${formattedEntry} SOL`}</span>
                         </div>
                      </div>
                    </div>
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
