'use client';

import React from 'react';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { locales } from '@/lib/locales';
import { useAuthStore } from '@/store/useAuthStore';

export default function HowItWorksPage() {
  const { locale } = useAuthStore();
  const t = locales[locale].howItWorksPage;

  return (
    <div className="pt-10 pb-20">
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl sm:text-5xl font-black mb-4 uppercase italic">
          {t.title} <span className="text-gradient-pitch">{t.highlight}</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto uppercase tracking-widest text-[10px] font-black leading-relaxed">
          {t.subtitle}
        </p>
      </div>
      
      {/* Reusing existing mechanics presentation */}
      <HowItWorks />

      <div className="max-w-4xl mx-auto px-4 mt-20">
        <div className="glass p-8 rounded-3xl border border-primary/20 bg-black/40">
          <h3 className="text-2xl font-bold mb-6 text-primary uppercase italic">{t.pointsTitle}</h3>
          <ul className="space-y-4 text-muted-foreground leading-relaxed text-xs uppercase tracking-wider font-black">
             <li className="flex gap-4">
               <span className="font-bold text-white w-20 shrink-0">10 {t.pts}</span>
               <span><strong>{t.correctResult}</strong> {t.correctResultDesc}</span>
             </li>
             <li className="flex gap-4">
               <span className="font-bold text-white w-20 shrink-0">+5 {t.pts}</span>
               <span><strong>{t.exactScore}</strong> {t.exactScoreDesc}</span>
             </li>
             <li className="flex gap-4">
               <span className="font-bold text-gold w-20 shrink-0">x1.5</span>
               <span><strong>{t.multiplierKnockout}</strong> {t.multiplierKnockoutDesc}</span>
             </li>
             <li className="flex gap-4">
               <span className="font-bold text-gold w-20 shrink-0">x2.0</span>
               <span><strong>{t.multiplierFinals}</strong> {t.multiplierFinalsDesc}</span>
             </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
