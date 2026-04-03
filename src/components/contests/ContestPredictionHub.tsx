'use client';

import { useState } from 'react';
import { PredictionForm } from './PredictionForm';
import { TournamentRankings } from './TournamentRankings';
import { LayoutGrid, ListOrdered, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  contestId: string;
  matches: any[];
  existingPredictions: any[];
  isLocked: boolean;
  isEntered: boolean;
  entryFeeSOL: number;
  userWallet?: string;
  userName?: string;
}

export function ContestPredictionHub({ 
  contestId, 
  matches, 
  existingPredictions, 
  isLocked, 
  isEntered, 
  entryFeeSOL,
  userWallet,
  userName
}: Props) {
  const [activeTab, setActiveTab] = useState<'matches' | 'rankings'>('matches');
  const [simulatedPoints, setSimulatedPoints] = useState<number | undefined>(undefined);

  return (
    <div className="space-y-8">
      {/* ═ TACTICAL TAB SELECTOR ═ */}
      <div className="flex bg-midnight/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl w-full sm:w-fit">
        <button 
          onClick={() => setActiveTab('matches')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'matches' ? 'bg-primary text-midnight shadow-[0_0_20px_#00E67644]' : 'text-muted-foreground hover:text-white'}`}
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Matches
        </button>
        <button 
          onClick={() => setActiveTab('rankings')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'rankings' ? 'bg-primary text-midnight shadow-[0_0_20px_#00E67644]' : 'text-muted-foreground hover:text-white'}`}
        >
          <ListOrdered className="w-3.5 h-3.5" /> Rankings
          {simulatedPoints !== undefined && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-gold rounded-full" />
          )}
        </button>
      </div>

      {/* ═ CONTENT AREA ═ */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'matches' ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
               <div className="relative">
                  {/* Simulation Helper Float */}
                  {simulatedPoints !== undefined && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="fixed bottom-10 right-10 z-[100] h-14 pl-6 pr-2 rounded-2xl bg-gold/90 backdrop-blur-xl border border-gold text-midnight flex items-center gap-6 shadow-2xl stadium-shadow"
                    >
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Potential Score</span>
                          <span className="text-xl font-black italic tabular-nums">+{simulatedPoints} PTS</span>
                       </div>
                       <button 
                         onClick={() => setActiveTab('rankings')}
                         className="h-10 px-4 rounded-xl bg-midnight text-gold text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                       >
                         Preview Rank
                       </button>
                    </motion.div>
                  )}
                  
                  <PredictionForm 
                    contestId={contestId}
                    matches={matches}
                    existingPredictions={existingPredictions}
                    isLive={isLocked}
                    isEntered={isEntered}
                    entryFeeSOL={entryFeeSOL}
                    onPredictionsChange={(pts) => setSimulatedPoints(pts)}
                  />
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key="rankings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-gold/10 border border-gold/20 w-fit">
                   <Sparkles className="w-4 h-4 text-gold" />
                   <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Live Simulation Mode Active</span>
                </div>
                <TournamentRankings 
                  contestId={contestId} 
                  simulatedPoints={simulatedPoints}
                  userWallet={userWallet}
                  userName={userName}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
