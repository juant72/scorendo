'use client';

import React, { useEffect, useState } from 'react';
import { Users, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommunityTrendsProps {
  matchId: string;
}

export function CommunityTrends({ matchId }: CommunityTrendsProps) {
  const [trends, setTrends] = useState<{ home: number; draw: number; away: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch(`/api/predictions/trends/${matchId}`);
        const data = await res.json();
        if (data.success) {
          setTrends(data.trends);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [matchId]);

  if (loading || !trends || trends.total === 0) return null;

  return (
    <div className="w-full bg-black/40 border border-white/5 rounded-xl p-3 sm:p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-white/40 italic">
           <Users size={12} className="text-primary" />
           Wisdom of the Crowd
        </div>
        <div className="text-[10px] font-mono text-muted-foreground">{trends.total} Votes</div>
      </div>

      <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
         {/* Home Bar */}
         <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${trends.home}%` }}
            className="h-full bg-primary/80" 
            title={`Home: ${trends.home}%`}
         />
         {/* Draw Bar */}
         <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${trends.draw}%` }}
            className="h-full bg-white/20" 
            title={`Draw: ${trends.draw}%`}
         />
         {/* Away Bar */}
         <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${trends.away}%` }}
            className="h-full bg-white/10 border-l border-white/5" 
            title={`Away: ${trends.away}%`}
         />
      </div>

      <div className="flex justify-between items-center mt-3 text-[10px] font-black italic uppercase tracking-tighter">
         <div className="flex flex-col">
            <span className="text-primary">{trends.home}%</span>
            <span className="text-white/20">Home</span>
         </div>
         <div className="flex flex-col text-center">
            <span className="text-white/60">{trends.draw}%</span>
            <span className="text-white/20">Draw</span>
         </div>
         <div className="flex flex-col text-right">
            <span className="text-white/80">{trends.away}%</span>
            <span className="text-white/20">Away</span>
         </div>
      </div>
    </div>
  );
}
