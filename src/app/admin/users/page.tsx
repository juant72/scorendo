'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Loader2, TrendingUp, Shield, Globe, Award, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 🚀 Intelligence Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
           <TrendingUp size={240} className="text-primary" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
           <div className="p-5 bg-primary/20 rounded-3xl shadow-2xl border border-primary/20">
              <Users className="w-10 h-10 text-primary" />
           </div>
           <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tight">User <span className="text-primary">Intelligence</span></h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.4em]">Behavioral Analytics & User Lifecycle Management</p>
           </div>
        </div>

        <div className="flex gap-4 relative z-10">
           <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 text-center">
              <div className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">Total Population</div>
              <div className="text-2xl font-black italic">{stats?.totalUsers || 0}</div>
           </div>
           <div className="bg-primary/10 px-6 py-3 rounded-2xl border border-primary/10 text-center">
              <div className="text-[8px] font-black uppercase text-primary tracking-widest mb-1">Active (24h)</div>
              <div className="text-2xl font-black italic text-primary">{stats?.activeToday || 0}</div>
           </div>
        </div>
      </div>

      {/* 🔍 Search & Filters */}
      <div className="flex gap-4 items-center bg-card/30 p-4 rounded-3xl border border-white/5">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
               placeholder="Search by Wallet, Name or Email..." 
               className="pl-12 bg-white/5 border-none h-14 rounded-2xl focus:ring-1 ring-primary/40 transition-all font-mono text-xs"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <Button variant="outline" className="h-14 w-14 rounded-2xl border-white/5 bg-white/5 opacity-50"><Filter size={20} /></Button>
      </div>

      {/* 📊 Users Grid/Table */}
      <Card className="bg-card/40 border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity & Wallet</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Xp / LVL</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Activity</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                     <tr key={user.walletAddress} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 font-black text-xs">
                                 {user.displayName?.[0] || 'U'}
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-black uppercase italic tracking-tight text-sm">
                                    {user.displayName || 'Anonymous Player'}
                                    {user.isAdmin && <Badge className="ml-2 bg-primary/20 text-primary border-none text-[8px] h-4">ADMIN</Badge>}
                                 </span>
                                 <span className="text-[10px] font-mono text-muted-foreground opacity-50 flex items-center gap-1.5">
                                    <Globe size={10} /> {user.walletAddress.slice(0, 16)}...
                                 </span>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1 text-primary">
                                 <Award size={12} />
                                 <span className="font-black italic text-sm">{user.level}</span>
                              </div>
                              <div className="text-[9px] font-mono text-muted-foreground font-bold">{user.xp} XP</div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex justify-center gap-6">
                              <div className="text-center">
                                 <div className="text-[8px] font-black uppercase text-muted-foreground tracking-widest opacity-50 mb-1">Predictions</div>
                                 <div className="font-black text-sm">{user._count.predictions}</div>
                              </div>
                              <div className="text-center">
                                 <div className="text-[8px] font-black uppercase text-muted-foreground tracking-widest opacity-50 mb-1">TXs</div>
                                 <div className="font-black text-sm">{user._count.transactions}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-muted-foreground flex items-center gap-2 italic">
                                 <Calendar size={12} /> {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-[9px] font-mono opacity-30">Account Linked</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-primary/20 hover:text-primary transition-all">
                              <Mail size={16} />
                           </Button>
                           <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white/10 ml-2">
                              <Shield size={16} />
                           </Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {filteredUsers.length === 0 && (
            <div className="py-20 text-center opacity-30 italic text-xs uppercase tracking-[0.3em] font-black">
               No intelligence signatures matching your criteria.
            </div>
         )}
      </Card>
    </div>
  );
}
