'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { locales } from '@/lib/locales';
import { Loader2, Shield, Share2, PlusCircle, Key } from 'lucide-react';
import { ContestCard } from '@/components/contests/ContestCard';
import { CreatePrivateModal } from '@/components/contests/CreatePrivateModal';

export default function ContestsLobbyPage() {
  const { locale } = useAuthStore();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const t = locales[locale].lobby;

  useEffect(() => {
    fetch('/api/contests')
      .then(res => res.json())
      .then(data => {
        setCompetitions(data.competitions || []);
      })
      .catch(err => console.error('Failed to fetch contests:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
     return (
       <div className="flex items-center justify-center min-h-[60vh]">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
  }

  const handleJoinPrivate = async () => {
    if (!inviteCode || joining) return;
    setJoining(true);
    setJoinError('');
    try {
      const res = await fetch('/api/contests/join-private', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: inviteCode.trim().toUpperCase() })
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = `/contests/${data.contestSlug}`;
      } else {
        setJoinError(data.error || 'Failed to join');
      }
    } catch (err) {
      setJoinError('Connection error');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 font-sans">
      
      {/* Create Modal */}
      <CreatePrivateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Header */}
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
           <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t.liveNetwork}</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tighter leading-[0.85] text-white">
          {t.title.split('World')[0]} <span className="text-primary italic">World</span> <br/>
          <span className="text-white opacity-90">{t.title.split('World')[1]?.trim() || 'Competitions'}</span>
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Discovery Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        
        {/* Left: Global Pro Leagues */}
        <div className="lg:col-span-8 space-y-12">
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-4">
              <span className="h-[2px] w-8 bg-primary/30" /> {locale === 'en' ? 'Professional Leagues' : 'Ligas Profesionales'}
           </h2>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             {competitions.length > 0 ? competitions.map((comp: any) => (
               <div key={comp.id} className="group relative glass-strong rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/40 transition-all hover:-translate-y-2 shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="p-8 pb-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 mb-8 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                         <Shield className="w-8 h-8 text-primary opacity-80" />
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2 leading-tight tracking-tight">{comp.name}</h3>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {comp.category || 'International'}
                      </p>
                    </div>

                    <div className="mt-12 space-y-3">
                      {comp.tournaments?.flatMap((t: any) => t.contests || []).map((contest: any) => (
                         <div 
                           key={contest.id} 
                           onClick={() => window.location.href = `/contests/${contest.slug}`}
                           className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/contest cursor-pointer"
                         >
                            <div className="flex items-center gap-3">
                               <div className="text-primary"><PlusCircle className="w-4 h-4" /></div>
                               <div>
                                 <div className="text-xs font-black text-white group-hover/contest:text-primary transition-colors">{contest.name}</div>
                                 <div className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">{contest.status}</div>
                               </div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover/contest:bg-primary group-hover/contest:text-white transition-all">
                               <span className="text-[10px] font-black">→</span>
                            </div>
                         </div>
                      ))}

                      {(!comp.tournaments || comp.tournaments.length === 0) && (
                        <p className="text-xs text-muted-foreground italic px-4 py-8 border border-dashed border-white/10 rounded-2xl text-center">
                          No active matchdays discovered.
                        </p>
                      )}
                    </div>
                 </div>
               </div>
             )) : (
                <div className="sm:col-span-2 text-center py-20 glass rounded-[2.5rem] border-dashed border-white/10">
                   <p className="text-muted-foreground">Initializing world databases...</p>
                </div>
             )}
           </div>
        </div>

        {/* Right: Private Corporate Leagues */}
        <div className="lg:col-span-4 lg:border-l border-white/5 lg:pl-12 space-y-12">
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-4">
              <span className="h-[2px] w-8 bg-primary/50" /> {locale === 'en' ? 'Private Battles' : 'Batallas Privadas'}
           </h2>

           <div className="space-y-8">
              {/* Join via Code */}
              <div className="glass-strong rounded-[2.5rem] p-10 border border-primary/20 relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                 <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Key className="w-6 h-6 text-primary" />
                 </div>
                 <h4 className="text-2xl font-black text-white mb-2">{locale === 'en' ? 'Got an Invite?' : '¿Tienes Invitación?'}</h4>
                 <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Enter the league code to join your company or team battle.</p>
                 
                 <div className="space-y-4">
                   <input 
                     type="text" 
                     value={inviteCode}
                     onChange={(e) => {
                       setInviteCode(e.target.value);
                       setJoinError('');
                     }}
                     placeholder="CODE-123-ABC"
                     className={`w-full h-14 bg-black/40 border rounded-2xl px-4 text-center font-mono text-lg font-bold tracking-[0.2em] focus:border-primary outline-none transition-all placeholder:text-white/10 ${joinError ? 'border-red-500/50' : 'border-white/10'}`}
                   />
                   {joinError && <p className="text-[10px] text-red-400 font-bold text-center animate-pulse">{joinError}</p>}
                   <button 
                     onClick={handleJoinPrivate}
                     disabled={joining || !inviteCode}
                     className="w-full h-14 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:glow-green transition-all shadow-lg active:scale-95 disabled:opacity-50"
                   >
                      {joining ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : (locale === 'en' ? 'Join League' : 'Unirse a la Liga')}
                   </button>
                 </div>
              </div>

              {/* Create Private League */}
              <div 
                onClick={() => setIsModalOpen(true)}
                className="glass-strong rounded-[2.5rem] p-10 border border-white/5 hover:border-primary/40 transition-all group cursor-pointer relative overflow-hidden"
              >
                 <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-center justify-center group-hover:bg-primary/20 transition-all shadow-inner">
                    <PlusCircle className="w-7 h-7 text-primary" />
                 </div>
                 <h4 className="text-xl font-black text-white mb-2 leading-tight">{locale === 'en' ? 'Sponsor a League' : 'Patrocinar una Liga'}</h4>
                 <p className="text-xs text-muted-foreground leading-relaxed">Clone a pro tournament for your company and lead the private scoreboard.</p>
                 
                 <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                    <span>{locale === 'en' ? 'Click to Start' : 'Click para Empezar'}</span>
                    <span>→</span>
                 </div>
              </div>

              {/* Information / Disclaimer */}
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5 text-[10px] text-muted-foreground/60 leading-relaxed italic">
                 Private leagues are isolated pools. Results are cloned from professional matchdays but scores and prizes are independent.
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
