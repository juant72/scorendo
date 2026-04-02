import { ContestType, ContestStatus } from '@prisma/client';
import { Users, Coins, Trophy, Clock, Medal } from 'lucide-react';
import Link from 'next/link';
import { formatDateShort } from '@/lib/utils';

interface ContestCardProps {
  id: string;
  slug: string;
  name: string;
  type: ContestType;
  status: ContestStatus;
  entryFeeSOL: number;
  prizePool: number | bigint;
  currentEntries: number;
  maxParticipants?: number | null;
  startDate: Date;
}

export function ContestCard({
  slug,
  name,
  type,
  status,
  entryFeeSOL,
  prizePoolPoolAmount = 0,
  currentEntries,
  maxParticipants,
  startDate,
}: ContestCardProps & { prizePoolPoolAmount?: number }) {

  const isFree = entryFeeSOL === 0;
  const isLive = status === ContestStatus.ACTIVE;
  const isPremium = prizePoolPoolAmount > 10; // e.g. 10 SOL is premium

  // Visual theming based on FREE vs PAID and Prize size
  const cardBorder = isPremium 
    ? 'border-gold/50 shadow-[0_0_20px_-5px_rgba(255,215,0,0.3)] glow-gold hover:border-gold' 
    : 'border-border/30 hover:border-primary/50';

  const formatType = (t: string) => t.replace('_', ' ');

  return (
    <Link href={`/contests/${slug}`} className="block">
      <div className={`relative flex flex-col justify-between overflow-hidden transition-all duration-300 glass rounded-2xl p-6 h-full cursor-pointer hover:-translate-y-1.5 ${cardBorder}`}>
        
        {/* Glow Accent */}
        {isPremium && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        )}
        {(isLive || isFree) && !isPremium && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        )}

        {/* Top Header: Free badge, Type, Status */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1">
               {type === ContestType.GRAND_TOURNAMENT && <Medal className="h-4 w-4 text-gold mb-0.5" />}
               {formatType(type)}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-foreground drop-shadow-sm line-clamp-2 leading-tight">
              {name}
            </h3>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {isFree ? (
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center rounded-md bg-primary/20 px-2 py-1 text-xs font-black text-primary ring-1 ring-inset ring-primary/30 shadow-sm animate-pulse">
                  FREE ENTRY
                </span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-70 tracking-tight">
                  No Wallet Needed
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-white/10">
                {entryFeeSOL} SOL
              </span>
            )}
            
            {isLive ? (
              <span className="text-[10px] sm:text-xs font-bold text-primary animate-pulse tracking-wide">
                ● LIVE NOW
              </span>
            ) : (
              <span className="text-[10px] sm:text-xs text-muted-foreground tracking-wide flex items-center gap-1">
                <Clock className="h-3 w-3" /> Starts {formatDateShort(startDate)}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-border/20">
           {/* Prize Pool */}
           <div>
             <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1 shadow-sm">
               Prize Pool
             </span>
             <div className="flex items-center gap-2">
               <Trophy className={`h-5 w-5 ${isPremium ? 'text-gold' : 'text-primary'}`} />
               <span className={`text-lg sm:text-xl font-black ${isPremium ? 'text-gradient-gold' : 'text-foreground'}`}>
                 {prizePoolPoolAmount > 0 ? `${prizePoolPoolAmount} SOL` : 'TBA'}
               </span>
             </div>
           </div>

           {/* Participants */}
           <div>
             <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">
               Participants
             </span>
             <div className="flex items-center gap-2">
               <Users className="h-5 w-5 text-muted-foreground/60" />
               <span className="text-lg sm:text-xl font-bold text-foreground">
                 {currentEntries} <span className="text-sm font-medium text-muted-foreground/50">/ {maxParticipants || '∞'}</span>
               </span>
             </div>
           </div>
        </div>
      </div>
    </Link>
  );
}
