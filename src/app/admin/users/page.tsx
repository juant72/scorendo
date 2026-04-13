'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Loader2, TrendingUp, Shield, Globe, Award, Mail, Calendar, ArrowUpRight, ChevronRight, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function UserIntelligence() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Intelligence Fetch Failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Scanning Neural Links...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-up">
      
      {/* ── INTELLIGENCE HEADER ── */}
      <div className="relative p-12 rounded-[2.5rem] overflow-hidden glass-premium border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Users size={300} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="h-0.5 w-12 bg-primary" />
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Network Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">
              User <span className="text-primary italic">Analytics</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase max-w-xl leading-relaxed">
               Global Predictor Hub • Behavioral Analysis • Account Integrity Control
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <StatsCircle label="Total Population" value={stats?.totalUsers || 0} icon={<Globe size={14} className="text-sky-400" />} />
            <StatsCircle label="Active Links (24h)" value={stats?.activeToday || 0} icon={<Zap size={14} className="text-primary hover:animate-pulse" />} />
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER TRAY ── */}
      <div className="flex gap-4 items-center glass-premium p-4 rounded-3xl border border-white/5 relative z-20">
         <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
               <Search className="text-white/20 group-hover:text-primary transition-colors" size={18} />
            </div>
            <input 
               placeholder="Search by Wallet, Identifier or Neural Link..." 
               className="w-full pl-14 pr-6 bg-white/2 border border-white/5 h-14 rounded-2xl focus:ring-1 ring-primary/40 focus:bg-white/5 transition-all outline-none font-mono text-[10px] uppercase tracking-widest text-white placeholder:text-white/10"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <button className="h-14 px-8 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
            <Filter size={16} /> Filters
         </button>
      </div>

      {/* ── USER TABLE ── */}
      <div className="glass-premium rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/2 border-b border-white/5">
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Identity & Terminal</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Score / Tier</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Metric Intensity</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Infiltration Date</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right"> Clearance</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                  {filteredUsers.map((user) => (
                     <tr key={user.walletAddress} className="group hover:bg-white/[0.02] transition-colors relative">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-5">
                              <div className="relative">
                                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/2 border border-white/10 flex items-center justify-center font-black text-sm italic group-hover:scale-105 transition-transform overflow-hidden shadow-xl">
                                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                                    {user.displayName?.[0] || 'U'}
                                 </div>
                                 <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-midnight bg-primary group-hover:animate-pulse`} />
                              </div>
                              <div className="flex flex-col">
                                 <div className="flex items-center gap-2">
                                    <span className="font-black uppercase italic tracking-tighter text-white group-hover:text-primary transition-colors text-base">
                                       {user.displayName || 'Anonymous Host'}
                                    </span>
                                    {user.isAdmin && (
                                      <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 text-[8px] h-4 font-black uppercase tracking-[0.2em]">S-CLASS</Badge>
                                    )}
                                 </div>
                                 <span className="text-[9px] font-black font-mono text-white/20 uppercase tracking-[0.2em] flex items-center gap-1.5 group-hover:text-white/40 transition-colors mt-1">
                                    {user.walletAddress.slice(0, 12)}...{user.walletAddress.slice(-8)}
                                 </span>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-center">
                           <div className="flex flex-col items-center gap-1.5">
                              <div className="flex items-center gap-1.5 text-primary">
                                 <Award size={14} className="group-hover:rotate-12 transition-transform" />
                                 <span className="font-black italic text-base">LVL {user.level}</span>
                              </div>
                              <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[8px] font-black text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">{user.xp} EXPERIENCE</div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex justify-center gap-10">
                              <MetricBox label="Predictions" value={user._count.predictions} icon={<LineChart size={10} />} />
                              <MetricBox label="Network TX" value={user._count.transactions} icon={<Zap size={10} />} />
                           </div>
                        </td>
                        <td className="px-10 py-8 text-center text-center">
                           <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] font-black text-white italic tracking-widest flex items-center gap-2">
                                 <Calendar size={12} className="text-primary" /> {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-[8px] font-black uppercase text-white/10 tracking-[0.3em]">Node Linked</span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex justify-end gap-3">
                              <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-primary hover:border-primary/30 transition-all hover:scale-110">
                                 <Mail size={16} />
                              </button>
                              <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all group-hover:border-white/20">
                                 <ChevronRight size={18} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {filteredUsers.length === 0 && (
            <div className="py-24 text-center">
               <div className="w-20 h-20 rounded-full bg-white/2 border border-dashed border-white/10 flex items-center justify-center mx-auto mb-6 opacity-40">
                  <Search size={30} className="text-white/20" />
               </div>
               <div className="opacity-30 italic text-[10px] uppercase tracking-[0.5em] font-black">
                  Zero intelligence signatures detected in current sector.
               </div>
            </div>
         )}
      </div>
    </div>
  );
}

function StatsCircle({ label, value, icon }: { label: string, value: number | string, icon: React.ReactNode }) {
  return (
    <div className="px-10 py-6 glass-premium bg-white/2 border-white/5 rounded-3xl flex flex-col items-end min-w-[220px] group/stat">
       <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1 transition-colors group-hover/stat:text-white/40">{label}</span>
       <div className="flex items-center gap-3">
          <div className="group-hover/stat:scale-125 transition-transform duration-500">{icon}</div>
          <span className="text-3xl font-black text-white italic group-hover/stat:text-primary transition-colors">{value}</span>
       </div>
    </div>
  );
}

function MetricBox({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="text-center group/metric">
       <div className="flex items-center justify-center gap-1.5 text-[8px] font-black uppercase text-white/20 tracking-[0.2em] mb-1.5 group-hover/metric:text-white/40 transition-colors">
          {icon} {label}
       </div>
       <div className="font-black text-lg text-white group-hover/metric:text-primary transition-all tracking-tighter">{value}</div>
    </div>
  );
}

function LineChart({ size, className }: { size: number, className?: string }) {
  return <TrendingUp size={size} className={className} />;
}
