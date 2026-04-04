import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Trophy, Settings, ArrowLeft, Zap, Wallet, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Admin Sidebar */}
      <aside className="w-72 border-r border-border/50 bg-card/50 backdrop-blur-xl p-8 fixed h-full hidden lg:block overflow-y-auto">
        <div className="flex items-center gap-4 mb-12 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-black text-midnight italic shadow-lg shadow-primary/20 group-hover:scale-110 transition-all">S</div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter uppercase italic leading-none">Scorendo</span>
            <span className="text-[9px] font-mono text-primary uppercase tracking-[0.2em]">Grandmaster OS</span>
          </div>
        </div>

        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/15 transition-all text-xs uppercase tracking-widest border border-primary/10 mb-6">
            <LayoutDashboard size={14} />
            Command Center
          </Link>
          
          <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] px-4 py-2 mt-4">Operations</div>
          <Link href="/admin/oracle" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <Zap size={14} className="text-primary" />
            Oracle Hub
          </Link>
          <Link href="/admin/settle" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <Trophy size={14} className="text-gold" />
            Prize Settlement
          </Link>
          
          <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] px-4 py-2 mt-4">Architecture</div>
          <Link href="/admin/competitions" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <Settings size={14} />
            Competition Studio
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <Users size={14} />
            User Intelligence
          </Link>
          <Link href="/admin/audit" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-emerald-400" />
            Audit Ledger
          </Link>
        </nav>

        <div className="absolute bottom-10 left-8 right-8 pt-6 border-t border-border/10">
          <Link href="/" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Exit Console
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen relative">
        <div className="p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
