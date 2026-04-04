'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Calendar, Shield, Settings2, Loader2, Save, X, Layers, Target, Edit3, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
      const data = await res.json();
      if (data.success) {
        alert(step === 'CREATE_TOURNAMENT' ? 'Tournament Architecture Locked.' : 'Tournament Parameters Updated.');
        fetchTournaments();
        setStep('LIST');
      }
    } catch (err) {
      alert('Operational Failure.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMatch = async () => {
    if (!matchData.homeTeamId || !matchData.awayTeamId || !matchData.startTime) {
      alert('Missing Critical Match Data.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/matches/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...matchData,
          tournamentId: activeTournament.id
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Match Fabricated Successfully.');
        setStep('LIST');
      } else {
        alert('Fabrication Failed: ' + data.error);
      }
    } catch (err) {
      alert('Structural Error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center bg-card/40 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-primary/20 rounded-2xl">
              <Trophy className="w-8 h-8 text-primary" />
           </div>
           <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tight">Competition <span className="text-primary italic">Studio</span></h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">Management & Parametrization Office</p>
           </div>
        </div>
        
        {step === 'LIST' ? (
          <Button 
            onClick={handleOpenCreate}
            className="h-12 bg-primary text-midnight font-black uppercase text-[10px] tracking-widest px-8 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105"
          >
            <Plus className="mr-2" size={16} /> New Tournament
          </Button>
        ) : (
          <Button onClick={() => setStep('LIST')} variant="ghost" className="text-muted-foreground font-bold text-xs uppercase tracking-widest">
            <ArrowLeft className="mr-2" size={16} /> Dashboard
          </Button>
        )}

       {step === 'ADD_MATCH' && (
         <div className="max-w-2xl mx-auto">
           <Card className="bg-card/60 backdrop-blur-2xl border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl relative">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Target size={120} className="text-primary animate-pulse" />
             </div>
             
             <div className="space-y-8 relative z-10">
                <div className="space-y-2 border-b border-white/10 pb-6 text-center">
                   <h2 className="text-3xl font-black italic uppercase">
                     Match <span className="text-primary italic">Fabricator</span>
                   </h2>
                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                     Drafting Conflict for {activeTournament?.name}
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Home Team</label>
                      <select 
                        value={matchData.homeTeamId}
                        onChange={(e) => setMatchData({...matchData, homeTeamId: e.target.value})}
                        className="w-full h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary transition-all text-sm px-6 font-medium text-white outline-none"
                      >
                         <option value="" className="bg-midnight text-white">Select Host</option>
                         {teams.map(team => (
                           <option key={team.id} value={team.id} className="bg-midnight text-white">{team.name}</option>
                         ))}
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Away Team</label>
                      <select 
                        value={matchData.awayTeamId}
                        onChange={(e) => setMatchData({...matchData, awayTeamId: e.target.value})}
                        className="w-full h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary transition-all text-sm px-6 font-medium text-white outline-none"
                      >
                         <option value="" className="bg-midnight text-white">Select Opponent</option>
                         {teams.map(team => (
                           <option key={team.id} value={team.id} className="bg-midnight text-white">{team.name}</option>
                         ))}
                      </select>
                   </div>

                   <FormInput 
                     label="Kick-off Time" 
                     placeholder="YYYY-MM-DDTHH:mm" 
                     value={matchData.startTime}
                     onChange={(v) => setMatchData({...matchData, startTime: v})}
                   />
                   <FormInput 
                     label="Arena / Stadium" 
                     placeholder="La Bombonera" 
                     value={matchData.stadium}
                     onChange={(v) => setMatchData({...matchData, stadium: v})}
                   />
                </div>

                <Button 
                  onClick={handleSaveMatch}
                  disabled={saving || !matchData.homeTeamId || !matchData.awayTeamId}
                  className="w-full h-16 bg-primary text-midnight font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-102 hover:shadow-primary/40 transition-all transition-transform"
                >
                   {saving ? <Loader2 className="animate-spin" /> : <Save className="mr-2" size={16} />}
                   {saving ? 'Fabricating Match...' : 'Deploy to Tournament'}
                </Button>
             </div>
           </Card>
         </div>
       )}
      </div>

      {step === 'LIST' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <Card key={t.id} className="bg-card/50 border-white/5 rounded-3xl hover:border-primary/40 transition-all group overflow-hidden">
               <div className="h-2 bg-primary/20 group-hover:bg-primary transition-all" />
               <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-all">
                        {t.logoUrl ? <img src={t.logoUrl} className="w-10 h-10 object-contain" /> : <Shield size={32} className="text-muted-foreground" />}
                     </div>
                     <Badge variant="outline" className="bg-primary/10 text-primary border-none text-[8px] font-black tracking-widest uppercase italic">
                        {t.status || 'ACTIVE'}
                     </Badge>
                  </div>
                  <CardTitle className="text-xl font-black italic tracking-tighter uppercase">{t.name}</CardTitle>
                  <CardDescription className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{t.slug}</CardDescription>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Season</span>
                        <span className="text-xs font-bold text-white">{t.season}</span>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Users</span>
                        <span className="text-xs font-bold text-primary font-mono tabular-nums">0</span>
                     </div>
                  </div>
                  
                  <div className="flex gap-2">
                     <Button 
                       onClick={() => handleEdit(t)}
                       className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-[9px] tracking-widest rounded-xl transition-all"
                     >
                        <Edit3 className="mr-2" size={14} /> Configure
                     </Button>
                     <Button 
                       onClick={() => handleOpenAddMatch(t)}
                       className="flex-1 h-12 bg-primary/10 hover:bg-primary/20 text-primary font-bold uppercase text-[9px] tracking-widest rounded-xl transition-all border border-primary/20"
                     >
                        <Plus className="mr-2" size={14} /> Add Match
                     </Button>
                     <Button className="h-12 w-12 bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 rounded-xl transition-all">
                        <Trash2 size={14} />
                     </Button>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(step === 'CREATE_TOURNAMENT' || step === 'EDIT_TOURNAMENT') && (
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/60 backdrop-blur-2xl border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
               <Settings2 size={120} className="text-primary animate-pulse" />
            </div>
            
            <div className="space-y-8 relative z-10">
               <div className="space-y-2 border-b border-white/10 pb-6 text-center">
                  <h2 className="text-3xl font-black italic uppercase">
                    {step === 'CREATE_TOURNAMENT' ? 'Initialize' : 'Modify'} <span className="text-primary italic">League</span>
                  </h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Global Competition Parameter Control</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput 
                    label="Official Name" 
                    placeholder="Superliga Argentina" 
                    value={formData.name}
                    onChange={(v) => setFormData({...formData, name: v, slug: v.toLowerCase().replace(/ /g, '-')})}
                  />
                  <FormInput 
                    label="Tournament Slug" 
                    placeholder="superliga-arg" 
                    value={formData.slug}
                    onChange={(v) => setFormData({...formData, slug: v})}
                  />
                  <FormInput 
                    label="Season Tag" 
                    placeholder="2026 / Winter" 
                    value={formData.season}
                    onChange={(v) => setFormData({...formData, season: v})}
                  />
                  <FormInput 
                    label="Logo Asset URL" 
                    placeholder="https://..." 
                    value={formData.logoUrl}
                    onChange={(v) => setFormData({...formData, logoUrl: v})}
                  />
               </div>

               <Button 
                 onClick={handleSaveTournament}
                 disabled={saving || !formData.name}
                 className="w-full h-16 bg-primary text-midnight font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-102 hover:shadow-primary/40 transition-all transition-transform"
               >
                  {saving ? <Loader2 className="animate-spin" /> : <Save className="mr-2" size={16} />}
                  {saving ? 'Syncing Records...' : step === 'CREATE_TOURNAMENT' ? 'Finalize Architecture' : 'Commit Changes'}
               </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function FormInput({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (v: string)=>void }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">{label}</label>
      <Input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary transition-all text-sm px-6 font-medium"
      />
    </div>
  );
}
