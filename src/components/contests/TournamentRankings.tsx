'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, Loader2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeInRow } from '@/components/layout/PageTransition';

interface RankUser {
  walletAddress: string;
  displayName: string;
  points: number;
  isSimulated?: boolean;
}

interface TournamentRankingsProps {
  contestId: string;
  simulatedPoints?: number;
  userName?: string;
  userWallet?: string;
}

export function TournamentRankings({ contestId, simulatedPoints, userName, userWallet }: TournamentRankingsProps) {
  const [ranks, setRanks] = useState<RankUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayRanks, setDisplayRanks] = useState<RankUser[]>([]);

  useEffect(() => {
    fetch(`/api/contests/${contestId}/rankings`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setRanks(json.rankings);
      })
      .finally(() => setLoading(false));
  }, [contestId]);

  useEffect(() => {
    let updatedRanks = [...ranks];
    if (simulatedPoints !== undefined && userWallet) {
       const userIdx = updatedRanks.findIndex(r => r.walletAddress === userWallet);
       if (userIdx > -1) {
          updatedRanks[userIdx] = { ...updatedRanks[userIdx], points: simulatedPoints, isSimulated: true };
       } else {
          updatedRanks.push({ 
            walletAddress: userWallet, 
            displayName: userName || 'Me (Simulated)', 
            points: simulatedPoints, 
            isSimulated: true 
          });
       }
       updatedRanks.sort((a, b) => b.points - a.points);
    }
    setDisplayRanks(updatedRanks);
  }, [ranks, simulatedPoints, userWallet, userName]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
        <Loader2 className="w-8 h-8 text-primary" />
      </motion.div>
      <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">Synchronizing Elite Standings</span>
    </div>
  );

  return (
    <div className="glass-strong rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl stadium-shadow relative">
      <div className="absolute inset-0 bg-net opacity-[0.05] pointer-events-none" />
      
      <table className="w-full text-sm text-left relative z-10">
        <thead className="bg-white/[0.03] text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-primary/60 border-b border-white/[0.05]">
          <tr>
            <th className="px-6 sm:px-10 py-6">Pos</th>
            <th className="px-6 sm:px-10 py-6">Elite Tactician</th>
            <th className="px-6 sm:px-10 py-6 text-right">XP / Score</th>
          </tr>
        </thead>
        
        <motion.tbody 
          className="divide-y divide-white/[0.05]"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.06 }
            }
          }}
        >
          {displayRanks.map((row, index) => (
            <FadeInRow 
              key={row.walletAddress}
              className={`transition-all group cursor-default ${row.isSimulated ? 'bg-gold/5 border-l-2 border-l-gold relative' : 'hover:bg-white/[0.03]'}`}
            >
              <td className="px-6 sm:px-10 py-5 sm:py-7">
                <div className="flex items-center gap-3 sm:gap-5">
                   <span className={`font-black italic text-lg sm:text-2xl ${
                     index === 0 ? 'text-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]' : 
                     index === 1 ? 'text-zinc-300' : 
                     index === 2 ? 'text-amber-700' : 
                     'text-white/20'
                   }`}>
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                   </span>
                   {index === 0 && <Crown className="w-4 h-4 text-gold animate-bounce" />}
                </div>
              </td>
              <td className="px-6 sm:px-10 py-5 sm:py-7">
                <div className="flex items-center gap-4">
                   <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-white/10 bg-gradient-to-br ${
                     index === 0 ? 'from-gold/20 to-gold/5 border-gold/30' : 
                     'from-white/10 to-transparent'
                   }`}>
                      <User className={`w-4 h-4 ${index === 0 ? 'text-gold' : 'text-white/40'}`} />
                   </div>
                   <div className="flex flex-col">
                      <span className="font-black text-xs sm:text-base text-white/90 group-hover:text-primary transition-colors italic uppercase tracking-tight">
                         {row.displayName || `${row.walletAddress.slice(0, 6)}...${row.walletAddress.slice(-4)}`}
                      </span>
                      {index < 3 && (
                        <span className="text-[8px] font-black text-primary/40 uppercase tracking-widest leading-none mt-1">Podium Qualifier</span>
                      )}
                      {row.isSimulated && (
                        <span className="text-[8px] font-black text-gold uppercase tracking-widest leading-none mt-1 italic animate-pulse">Simulation Active</span>
                      )}
                   </div>
                </div>
              </td>
              <td className="px-6 sm:px-10 py-5 sm:py-7 text-right">
                <div className="flex flex-col items-end">
                   <span className={`text-xl sm:text-3xl font-black italic ${
                     index === 0 ? 'text-gold drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'text-primary'
                   }`}>
                      {row.points}
                   </span>
                   <span className="text-[8px] font-black text-white/10 uppercase tracking-widest mt-1">Total Pts</span>
                </div>
              </td>
            </FadeInRow>
          ))}
          
          {displayRanks.length === 0 && (
            <tr>
              <td colSpan={3} className="px-10 py-24 text-center">
                 <div className="flex flex-col items-center opacity-30">
                    <Trophy className="w-12 h-12 mb-4 text-primary/40" />
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Standings Encrypting...</p>
                 </div>
              </td>
            </tr>
          )}
        </motion.tbody>
      </table>

      {/* ═ OFFICIAL VERIFICATION FOOTER ═ */}
      <div className="bg-white/[0.02] border-t border-white/[0.05] px-6 py-4 flex items-center justify-between gap-4">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_#00E676]" />
            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Official Results Protocol Active</span>
         </div>
         <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] italic">Verification courtesy of official league indices</span>
      </div>
    </div>
  );
}
