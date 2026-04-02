import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Trophy, Settings, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card p-6 fixed h-full hidden lg:block">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-white italic">S</div>
          <span className="text-xl font-bold tracking-tight">Admin Console</span>
        </div>

        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 transition-all">
            <Users size={18} />
            Users
          </Link>
          <Link href="/admin/contests" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 transition-all">
            <Trophy size={18} />
            Contests
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 transition-all">
            <Settings size={18} />
            AFA Settings
          </Link>
        </nav>

        <div className="absolute bottom-8 left-6 right-6 pt-6 border-t border-border/30">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Scorendo
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
