'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Target, Activity } from 'lucide-react';

export function SystemCalibration() {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    { label: 'Initializing Neural Interface', icon: Zap, color: 'text-primary' },
    { label: 'Verifying Solana Signature', icon: ShieldCheck, color: 'text-sky-400' },
    { label: 'Syncing Arena Oracles', icon: Activity, color: 'text-orange-500' },
    { label: 'Loading Tactical Assets', icon: Target, color: 'text-white' }
  ];

  useEffect(() => {
    // Check if we've already calibrated this session
    const hasCalibrated = sessionStorage.getItem('scorendo_calibrated');
    if (hasCalibrated) {
      setIsVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('scorendo_calibrated', 'true');
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-[#020814] flex items-center justify-center p-6 overflow-hidden"
        >
          {/* Diagnostic Grid */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBoNDB2LTQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-40 pointer-events-none" />
          
          <div className="relative w-full max-w-sm">
             {/* Scanner Box */}
             <div className="relative glass-strong rounded-[2.5rem] p-12 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
                
                {/* Scanning Line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-px bg-primary/50 shadow-[0_0_15px_rgba(0,230,118,1)] z-10"
                />

                <div className="relative z-20 flex flex-col items-center">
                   <motion.div 
                     key={step}
                     initial={{ scale: 0.5, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className={`w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 ${steps[step].color}`}
                   >
                      {React.createElement(steps[step].icon, { size: 40, className: 'drop-shadow-lg' })}
                   </motion.div>

                   <div className="space-y-4 w-full text-center">
                      <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Identity Check</h2>
                      <p className="text-xl font-black text-white uppercase italic tracking-tighter h-8">
                         {steps[step].label}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-8 border border-white/5">
                         <motion.div 
                           initial={{ width: '0%' }}
                           animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                           className={`h-full bg-primary shadow-[0_0_10px_rgba(0,230,118,0.5)] transition-all duration-300`}
                         />
                      </div>
                   </div>

                   <div className="mt-12 flex items-center gap-6 opacity-20">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                      <span className="text-[8px] font-mono tracking-widest text-white uppercase">Neural Link Established</span>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
