'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Calendar, Shield, Settings2, Loader2, Save, X, Layers, Target, Edit3, Trash2, ArrowLeft, ArrowUpRight, Globe, Zap, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function CompetitionStudio() {
  const [step, setStep] = useState<'LIST' | 'CREATE_TOURNAMENT' | 'EDIT_TOURNAMENT' | 'ADD_MATCH'>('LIST');
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTournament, setActiveTournament] = useState<any>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'FOOTBALL',
    country: 'ARGENTINA',
    season: '2026',
    logoUrl: ''
  });

  const [matchData, setMatchData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    startTime: '',
    stadium: '',
    phaseId: ''
  });

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/contests/league');
      const data = await res.json();
      if (data.success) setTournaments(data.competitions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/admin/teams');
      const data = await res.json();
      if (data.success) setTeams(data.teams || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchTeams();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ name: '', slug: '', category: 'FOOTBALL', country: 'ARGENTINA', season: '2026', logoUrl: '' });
    setActiveTournament(null);
    setStep('CREATE_TOURNAMENT');
  };

  const handleEdit = (t: any) => {
    setFormData({
      name: t.name,
      slug: t.slug,
      category: t.category,
      country: t.country,
      season: t.season,
      logoUrl: t.logoUrl || ''
    });
    setActiveTournament(t);
    setStep('EDIT_TOURNAMENT');
  };

  const handleOpenAddMatch = (t: any) => {
    setActiveTournament(t);
    setMatchData({
      homeTeamId: '',
      awayTeamId: '',
      startTime: '',
      stadium: '',
      phaseId: ''
    });
    setStep('ADD_MATCH');
  };

  const handleSaveTournament = async () => {
    setSaving(true);
    const endpoint = step === 'CREATE_TOURNAMENT' ? '/api/admin/tournaments/create' : `/api/admin/tournaments/${activeTournament.id}/update`;
    const method = step === 'CREATE_TOURNAMENT' ? 'POST' : 'PUT';
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const resData = await res.json();
      if (resData.success) {
        fetchTournaments();
        setStep('LIST');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMatch = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/tournaments/${activeTournament.id}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData)
      });
      const resData = await res.json();
      if (resData.success) {
        alert('Match created successfully.');
        setStep('LIST');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Loading Architect Studio...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-up">
      
      {/* ── STUDIO HEADER ── */}
      <div className="relative p-12 rounded-[2.5rem] overflow-hidden glass-premium border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Database size={300} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="h-0.5 w-12 bg-sky-400" />
               <span className="text-[10px] font-black text-sky-400 uppercase tracking-[0.5em]">Competition Architect</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">
              Arena <span className="text-sky-400 italic">Studio</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase max-w-xl leading-relaxed">
               Tournament Infrastructure • Match Scheduling • Asset Management
            </p>
          </div>

          <div className="flex gap-4">
            {step === 'LIST' ? (
              <button 
                onClick={handleOpenCreate}
                className="h-14 px-8 bg-primary text-midnight font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 group"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Initialize League
              </button>
            ) : (
              <button 
                onClick={() => setStep('LIST')}
                className="h-14 px-8 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <ArrowLeft size={16} /> Exit Studio
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── THEME WRAPPER ── */}
      <div className="relative overflow-hidden">
        
        {step === 'LIST' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.map((t) => (
              <div key={t.id} className="glass-premium rounded-[2.5rem] border-white/5 group hover:border-sky-400/30 transition-all duration-500 overflow-hidden shadow-xl hover:-translate-y-2">
                 <div className="h-2 bg-sky-400/10 group-hover:bg-sky-400 transition-all duration-700" />
                 
                 <div className="p-10 space-y-8">
                    <div className="flex justify-between items-start">
                       <div className="relative group/logo">
                          <div className="absolute -inset-2 bg-sky-400/20 blur-xl opacity-0 group-hover/logo:opacity-100 transition-opacity" />
                          <div className="relative w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 transition-transform group-hover/logo:scale-110">
                            {t.logoUrl ? <img src={t.logoUrl} className="w-12 h-12 object-contain" /> : <Shield size={32} className="text-white/10" />}
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[8px] font-black tracking-widest uppercase italic px-3 py-1">
                             {t.status || 'DEPLOYED'}
                          </Badge>
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{t.season}</span>
                       </div>
                    </div>

                    <div>
                       <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white group-hover:text-primary transition-colors">{t.name}</h3>
                       <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-1">SCTR-ID: {t.slug}</p>
                    </div>

                    <div className="flex gap-3">
                       <button 
                         onClick={() => handleEdit(t)}
                         className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-black uppercase text-[9px] tracking-widest rounded-xl transition-all border border-white/5"
                       >
                          <Edit3 className="mr-2 inline" size={14} /> Configure
                       </button>
                       <button 
                         onClick={() => handleOpenAddMatch(t)}
                         className="flex-1 h-12 bg-sky-400/10 hover:bg-sky-400 text-sky-400 hover:text-midnight font-black uppercase text-[9px] tracking-widest rounded-xl transition-all border border-sky-400/20"
                       >
                          <Plus className="mr-2 inline" size={14} /> Add Match
                       </button>
                    </div>
                 </div>
                 
                 {/* Decorative Bar */}
                 <div className="px-10 py-4 bg-white/2 border-t border-white/5 flex items-center justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
                    <span>Matches: {t._count?.matches || 0}</span>
                    <button className="hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE / EDIT FORMS */}
        {(step === 'CREATE_TOURNAMENT' || step === 'EDIT_TOURNAMENT' || step === 'ADD_MATCH') && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-premium rounded-[3rem] p-12 border-white/10 shadow-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                 {step === 'ADD_MATCH' ? <Target size={150} /> : <Settings2 size={150} />}
               </div>
               
               <div className="space-y-10 relative z-10">
                  <div className="space-y-3 border-b border-white/5 pb-10 text-center">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase tracking-widest mb-2">
                        System Architect Console
                     </div>
                     <h2 className="text-4xl font-black italic uppercase italic text-white leading-none">
                        {step === 'ADD_MATCH' ? 'Match' : step === 'CREATE_TOURNAMENT' ? 'Initialize' : 'Reform'} <span className="text-primary italic">{step === 'ADD_MATCH' ? 'Deployment' : 'League'}</span>
                     </h2>
                     <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">
                        {step === 'ADD_MATCH' ? `For Sector ${activeTournament?.name}` : 'Establishing Platform Infrastructure'}
                     </p>
                  </div>

                  {step === 'ADD_MATCH' ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-white/40 tracking-widest pl-2">Host Intelligence (Home)</label>
                           <select 
                             value={matchData.homeTeamId}
                             onChange={(e) => setMatchData({...matchData, homeTeamId: e.target.value})}
                             className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl focus:border-primary transition-all text-xs font-black uppercase tracking-widest text-white px-6 outline-none appearance-none"
                           >
                              <option value="" className="bg-midnight">Select Source</option>
                              {teams.map(team => (<option key={team.id} value={team.id} className="bg-midnight">{team.name}</option>))}
                           </select>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-white/40 tracking-widest pl-2">Opponent Target (Away)</label>
                           <select 
                             value={matchData.awayTeamId}
                             onChange={(e) => setMatchData({...matchData, awayTeamId: e.target.value})}
                             className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl focus:border-primary transition-all text-xs font-black uppercase tracking-widest text-white px-6 outline-none appearance-none"
                           >
                              <option value="" className="bg-midnight">Select Target</option>
                              {teams.map(team => (<option key={team.id} value={team.id} className="bg-midnight">{team.name}</option>))}
                           </select>
                        </div>
                        <FormInput label="Temporal Sync" placeholder="YYYY-MM-DDTHH:mm" value={matchData.startTime} onChange={(v) => setMatchData({...matchData, startTime: v})} />
                        <FormInput label="Geo-Location (Arena)" placeholder="MetLife Stadium" value={matchData.stadium} onChange={(v) => setMatchData({...matchData, stadium: v})} />
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <FormInput label="Protocol Name" placeholder="World Cup 2026" value={formData.name} onChange={(v) => setFormData({...formData, name: v, slug: v.toLowerCase().replace(/ /g, '-')})} />
                        <FormInput label="Sector Slug" placeholder="fwc-2026" value={formData.slug} onChange={(v) => setFormData({...formData, slug: v})} />
                        <FormInput label="Temporal Cycle" placeholder="2026 Season" value={formData.season} onChange={(v) => setFormData({...formData, season: v})} />
                        <FormInput label="Brand Asset ID" placeholder="https://..." value={formData.logoUrl} onChange={(v) => setFormData({...formData, logoUrl: v})} />
                     </div>
                  )}

                  <button 
                    onClick={step === 'ADD_MATCH' ? handleSaveMatch : handleSaveTournament}
                    disabled={saving || (step === 'ADD_MATCH' ? (!matchData.homeTeamId || !matchData.awayTeamId) : !formData.name)}
                    className="w-full h-16 bg-primary text-midnight font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-2xl shadow-primary/20 hover:scale-102 transition-all transition-transform disabled:opacity-30 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
                  >
                     <div className="relative z-10 flex items-center gap-3">
                        {saving ? <Loader2 className="animate-spin" /> : <Save className="group-hover/btn:scale-125 transition-transform" size={16} />}
                        {saving ? 'Syncing OS Intelligence...' : 'Authorize Commitment'}
                     </div>
                     <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormInput({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (v: string)=>void }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase text-white/40 tracking-widest pl-2">{label}</label>
      <input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl focus:border-primary transition-all text-xs font-black uppercase tracking-widest text-white px-6 outline-none placeholder:text-white/10"
      />
    </div>
  );
}
