'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, Loader2 } from 'lucide-react';

interface RankUser {
  walletAddress: string;
  displayName: string;
  points: number;
}

export function TournamentRankings({ contestId }: { contestId: string }) {
  const [ranks, setRanks] = useState<RankUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/contests/${contestId}/rankings`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setRanks(json.rankings);
      })
      .finally(() => setLoading(false));
  }, [contestId]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="glass-strong rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
      <table className="w-full text-sm text-left">
        <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-primary/60 border-b border-white/5">
          <tr>
            <th className="px-8 py-5">Rank</th>
            <th className="px-8 py-5">Predictor</th>
            <th className="px-8 py-5 text-right">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {ranks.map((row, index) => (
            <tr key={row.walletAddress} className="hover:bg-white/5 transition-all group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                   {index === 0 ? <Crown className="w-4 h-4 text-gold" /> : 
                    index === 1 ? <Medal className="w-4 h-4 text-zinc-300" /> : 
                    index === 2 ? <Medal className="w-4 h-4 text-amber-700" /> : null}
                   <span className={`font-black ${index < 3 ? 'text-lg text-white' : 'text-muted-foreground'}`}>#{index + 1}</span>
                </div>
              </td>
              <td className="px-8 py-5 font-bold text-white opacity-80 group-hover:opacity-100 italic transition-opacity">
                {row.displayName || `${row.walletAddress.slice(0, 5)}...${row.walletAddress.slice(-4)}`}
              </td>
              <td className="px-8 py-5 text-right">
                <span className="text-lg font-black text-primary drop-shadow-[0_0_8px_rgba(0,230,118,0.3)]">{row.points}</span>
              </td>
            </tr>
          ))}
          {ranks.length === 0 && (
            <tr>
              <td colSpan={3} className="px-8 py-16 text-center text-muted-foreground italic opacity-50">No activity in this arena yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
