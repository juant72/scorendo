'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Activity, ShieldCheck, Database, Server } from 'lucide-react';

const MOCK_ORACLE_EVENTS = [
  { id: 1, type: 'EXECUTION', text: 'Auth req: wallet_xA9...4bF', time: '0ms' },
  { id: 2, type: 'COMMIT', text: 'State locked [Match_0x9]', time: '142ms' },
  { id: 3, type: 'ORACLE', text: 'Data sync: F1 Monaco GP', time: '210ms' },
  { id: 4, type: 'SETTLEMENT', text: 'Tx Confirm: 12.4 SOL payout', time: '890ms' },
  { id: 5, type: 'EXECUTION', text: 'Auth req: wallet_xZ2...1jK', time: '1.2s' },
  { id: 6, type: 'COMMIT', text: 'Prediction matrix verified', time: '1.5s' }
];

export function NetworkFeed() {
  const [logs, setLogs] = useState(MOCK_ORACLE_EVENTS);

  // Fake log rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev.slice(1), { ...prev[0], id: Date.now(), time: Math.floor(Math.random() * 900) + 'ms' }];
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#020814] py-20 px-6 sm:px-12 border-b border-white/5">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
         
         {/* Live Oracle Feed */}
         <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
               <Activity size={14} className="text-white/40" />
               <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">Oracle Data Pipeline</span>
            </div>
            
            <div className="bg-[#060D1A] rounded-xl border border-white/5 p-6 h-64 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#060D1A] z-10 pointer-events-none" />
               
               <div className="space-y-3 font-mono text-[10px]">
                  {logs.map((log) => (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4"
                    >
                       <span className="text-primary/40 shrink-0 opacity-50">[{log.time}]</span>
                       <span className={`shrink-0 ${
                         log.type === 'EXECUTION' ? 'text-blue-400' : 
                         log.type === 'COMMIT' ? 'text-primary' : 
                         log.type === 'SETTLEMENT' ? 'text-gold' : 'text-white/40'
                       }`}>
                         {log.type}
                       </span>
                       <span className="text-white/60 truncate">{log.text}</span>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>

         {/* Protocol Specs */}
         <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
               <Database size={14} className="text-white/40" />
               <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">Protocol Verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               
               <div className="p-5 border border-white/5 rounded-xl bg-white/[0.01]">
                  <ShieldCheck size={16} className="text-primary mb-3" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Zero Trust</h3>
                  <p className="text-[10px] text-white/40 leading-relaxed font-mono">No middleman. Smart contracts settle immediately when official game data registers on the oracle.</p>
               </div>

               <div className="p-5 border border-white/5 rounded-xl bg-white/[0.01]">
                  <Server size={16} className="text-white/40 mb-3" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-1">High Density</h3>
                  <p className="text-[10px] text-white/40 leading-relaxed font-mono">Designed for rapid entries. Predict multi-league events concurrently without unnecessary UI inflation.</p>
               </div>

            </div>
         </div>

      </div>
    </section>
  );
}
