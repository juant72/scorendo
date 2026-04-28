'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Trophy, User, Target, Flame, Swords, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Hub', icon: <Target size={20} />, href: '/dashboard' },
    { name: 'Arena', icon: <Swords size={20} />, href: '/contests' },
    { name: 'Global', icon: <Flame size={20} />, href: '/ranking' },
    { name: 'Profile', icon: <User size={20} />, href: '/settings' },
    { name: 'Wallet', icon: <Wallet size={20} />, href: '/wallet' },
  ];

  return (
    <nav className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-sm">
      <div className="bg-midnight/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 shadow-[0_20px_50px_-20px_rgba(0,230,118,0.3)] ring-1 ring-white/5 relative overflow-hidden">
        {/* Glow behind active item */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="flex items-center justify-around relative z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className="relative flex flex-col items-center gap-1.5 px-4 py-2 group"
              >
                <div className={`relative transition-all duration-500 ${isActive ? 'text-primary' : 'text-white/40 group-hover:text-white/60'}`}>
                  {isActive && (
                    <motion.div 
                      layoutId="activeGlow"
                      className="absolute -inset-3 bg-primary/20 blur-xl rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={`relative z-10 transform ${isActive ? 'scale-110 -translate-y-1' : ''} transition-transform duration-300`}>
                    {item.icon}
                  </div>
                </div>
                
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'text-primary' : 'text-white/20'}`}>
                  {item.name}
                </span>

                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 h-[2px] w-4 bg-primary rounded-full shadow-[0_0_10px_#00e676]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
