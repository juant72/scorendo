import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Trophy, Settings, ArrowLeft, Zap, Wallet, ShieldCheck, Activity, Database, LineChart } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#020814] text-foreground font-sans">
      
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-72 right-0 h-px bg-gradient-to-r from-primary/30 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-gold/3 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-pitch-lines opacity-5" />
      </div>

      {/* ── Sidebar ── */}
      <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 fixed h-full hidden lg:flex flex-col z-[50]">
        
        {/* Brand */}
        <div className="flex items-center gap-4 mb-12 group cursor-pointer relative">
          <div className="relative">
             <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative w-11 h-11 rounded-xl bg-primary flex items-center justify-center font-black text-midnight italic shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">S</div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase italic leading-none text-white">Scorendo</span>
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Grandmaster OS</span>
          </div>
        </div>

        {/* Global Stats Snapshot */}
        <div className="mb-10 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">System Load</span>
            <span className="text-[8px] font-black uppercase text-primary">Optimal</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-primary w-[32%] rounded-full shadow-[0_0_8px_rgba(0,230,118,0.5)]" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-midnight font-black hover:bg-white transition-all text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 mb-8">
            <LayoutDashboard size={14} strokeWidth={3} />
            Command Center
          </Link>
          
          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] px-4 py-2 mt-6">Operations Hub</div>
          <div className="space-y-1">
            <SidebarLink href="/admin/oracle" icon={<Zap size={14} className="text-primary" />} label="Oracle Pulse" />
            <SidebarLink href="/admin/settle" icon={<Trophy size={14} className="text-gold" />} label="Settlement" />
            <SidebarLink href="/admin/scores" icon={<Activity size={14} className="text-sky-400" />} label="Live Scores" />
          </div>
          
          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] px-4 py-2 mt-6">Core Engine</div>
          <div className="space-y-1">
            <SidebarLink href="/admin/competitions" icon={<Database size={14} />} label="Arena Factory" />
            <SidebarLink href="/admin/users" icon={<Users size={14} />} label="User Intelligence" />
            <SidebarLink href="/admin/finance" icon={<LineChart size={14} className="text-emerald-400" />} label="Treasury" />
            <SidebarLink href="/admin/audit" icon={<ShieldCheck size={14} className="text-white/30" />} label="Security Audit" />
          </div>
        </nav>

        {/* Exit */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white hover:bg-white/5 transition-all group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Exit Console
          </Link>
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <main className="flex-1 lg:ml-72 min-h-screen relative z-10 flex flex-col">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(0,230,118,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Terminal Active · Node 01</span>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black uppercase text-white">Administrator</span>
                 <span className="text-[8px] font-mono text-white/30">ID: 99AC-BB7B</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 p-1">
                 <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-transparent" />
              </div>
           </div>
        </header>

        <div className="p-10 flex-1 max-w-[1400px]">
          {children}
        </div>

        {/* Console Status */}
        <footer className="h-10 border-t border-white/5 flex items-center justify-between px-10 bg-black/10 text-[8px] font-mono text-white/20">
           <span>DB SYNC: 100% · NETWORK: SOLANA MAINNET (SIMULATED)</span>
           <span>v4.2.0-ELITE</span>
        </footer>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group">
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      {label}
    </Link>
  );
}
