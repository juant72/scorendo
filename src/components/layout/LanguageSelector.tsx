'use client';

import React from 'react';
import { useAuthStore, Locale } from '@/store/useAuthStore';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { locale, setLanguage } = useAuthStore();

  const toggleLanguage = () => {
    const nextLocale: Locale = locale === 'en' ? 'es' : 'en';
    setLanguage(nextLocale);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      title={locale === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
    >
      <Globe className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
        {locale}
      </span>
    </button>
  );
}
