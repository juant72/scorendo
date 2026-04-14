import { ContestType, ContestStatus } from '@prisma/client';
import { Users, Crosshair, Trophy, Clock, Medal, Zap, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { formatDateShort } from '@/lib/utils';
import { motion } from 'framer-motion';
import { DataFlowPulse } from './LivePulse';
import { getArenaImagery } from '@/lib/graphics';

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

export default function ContestCard({
  slug,
  name,
  type,
  status,
  entryFeeSOL,
  prizePool,
  prizePoolPoolAmount = 0,
  currentEntries,
  maxParticipants,
  startDate,
}: ContestCardProps & { prizePoolPoolAmount?: number }) {

  const isFree = entryFeeSOL === 0;
  const isLive = status === ContestStatus.ACTIVE;
  const isPremium = prizePoolPoolAmount > 10; 
  const imagery = getArenaImagery({ name, slug });

  const cardBorder = isPremium 
    ? 'border-gold/40 shadow-[0_0_30px_-10px_rgba(255,215,0,0.3)] hover:border-gold' 
    : 'border-white/10 hover:border-primary/40';

  return (
    <Link href={`/contests/league/${slug}`} className="block group">
      <motion.div 
        whileHover={{ y: -8 }}
        className={`relative flex flex-col justify-between overflow-hidden transition-all duration-500 bg-[#060D1A] rounded-[2rem] p-7 h-full border-2 ${cardBorder}`}
      >
        {/* Tactical Background Elements */}
        <div className="absolute inset-0 z-0">
          <img 
            src={imagery.banner} 
            className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-all duration-1000 group-hover:scale-110" 
            alt="Arena" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A] via-[#060D1A]/70 to-transparent" />
        </div>

        {/* Status Badges */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_#00E676]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Sector Arena · Entry Alpha</span>
          </div>
          <DataFlowPulse />
        </div>

        <div className="flex items-start justify-between mb-8 relative z-10">
          <div className="flex flex-col gap-4">
            <div className={`flex items-center gap-3 px-3 py-1.5 rounded-xl w-fit bg-white/5 border border-white/10 backdrop-blur-xl shadow-inner`}>
               <img src={imagery.badge} alt="Arena Badge" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/40 leading-none mb-1">Sector Match</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#00E676] leading-none">Verified</span>
               </div>
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-primary transition-colors pr-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              {name}
            </h3>
          </div>
          
          <div className="flex flex-col items-end gap-2 drop-shadow-xl">
            {isFree ? (
              <div className="flex flex-col items-end">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 px-3 py-1.5 border border-primary/40 text-[9px] font-black text-primary uppercase tracking-widest shadow-[0_0_15px_rgba(0,230,118,0.2)]">
                  <Zap size={10} fill="currentColor" /> Open Access
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                {entryFeeSOL} SOL
              </div>
            )}
            
            {isLive ? (
              <div className="flex items-center gap-1.5 text-[9px] font-black text-primary tracking-widest uppercase mt-1 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Deployed
              </div>
            ) : (
              <div className="text-[9px] font-black text-white/30 tracking-widest uppercase flex items-center gap-1.5 mt-1">
                <Clock size={10} /> {formatDateShort(startDate)}
              </div>
            )}
          </div>
        </div>

        {/* Metrics Section: Stakes & Command */}
        <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/5 relative z-10">
           {/* Arena Stakes */}
           <div className="space-y-2">
             <div className="flex items-center gap-2 opacity-30">
               <ShieldAlert size={10} className={isPremium ? 'text-gold' : 'text-primary'} />
               <span className="text-[9px] uppercase font-black tracking-[0.2em] text-white">
                 Arena Stakes
               </span>
             </div>
             <div className="flex items-center gap-2.5">
               <Trophy className={`h-6 w-6 ${isPremium ? 'text-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'text-primary'}`} />
               <span className={`text-2xl font-black italic tracking-tighter ${isPremium ? 'text-gold' : 'text-white'}`}>
                 {(prizePoolPoolAmount > 0 || (prizePool && Number(prizePool) > 0)) ? `${prizePoolPoolAmount || (Number(prizePool) / 1e9)} SOL` : 'TBA'}
               </span>
             </div>
           </div>

           {/* Rivals Joined */}
           <div className="space-y-2">
             <div className="flex items-center gap-2 opacity-30">
               <Users size={10} className="text-white" />
               <span className="text-[9px] uppercase font-black tracking-[0.2em] text-white">
                 Rivals Deployed
               </span>
             </div>
             <div className="flex items-center gap-2.5">
               <Crosshair className="h-6 w-6 text-white/20" />
               <span className="text-2xl font-black italic tracking-tighter text-white/90">
                 {currentEntries} <span className="text-sm font-black text-white/20">/ {maxParticipants || '∞'}</span>
               </span>
             </div>
           </div>
        </div>

        {/* Hover Action Overlay Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left z-20" />
      </motion.div>
    </Link>
  );
}
