"use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Users, Key, Plus, ShieldAlert, Check } from 'lucide-react';
import { locales } from '@/lib/locales';

type Group = { id: string; name: string; inviteCode: string; ownerWallet: string; members: { userWallet: string }[] };

export function GroupsPanel() {
  const { user, isAuthenticated, locale } = useAuthStore();
  const t = locales[locale].groups;
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState(locale === 'es' ? 'Mi Grupo' : 'My Group');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<Group | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinStatus, setJoinStatus] = useState<string | null>(null);

  // Leaderboard Detail States
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupDetail, setSelectedGroupDetail] = useState<{ group: any; leaderboard: any[] } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      const r = await fetch('/api/groups/db/list');
      const data = await r.json();
      if (data?.groups) setGroups(data.groups);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchGroupDetail = async (groupId: string) => {
    setLoadingDetail(true);
    setDetailError(null);
    try {
      const res = await fetch(`/api/groups/db/detail?groupId=${groupId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedGroupDetail({
          group: data.group,
          leaderboard: data.leaderboard
        });
      } else {
        setDetailError(data.error || 'Failed to fetch details');
      }
    } catch {
      setDetailError('Network error fetching details');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    fetchGroupDetail(groupId);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
    } else {
      setGroups([]);
    }
  }, [isAuthenticated]);

  const create = async () => {
    if (!name || !isAuthenticated) return;
    setCreating(true);
    try {
      const res = await fetch('/api/groups/db/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        setCreated({
          id: data.groupId,
          name,
          inviteCode: data.inviteCode,
          ownerWallet: user?.walletAddress || '',
          members: [{ userWallet: user?.walletAddress || '' }]
        });
        fetchGroups();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const join = async () => {
    if (!joinCode || !isAuthenticated) return;
    setJoinStatus(null);
    try {
      const res = await fetch('/api/groups/db/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: joinCode }),
      });
      const data = await res.json();
      if (data.success) {
        setJoinStatus(t.joinSuccess);
        fetchGroups();
      } else {
        setJoinStatus(data.error || t.joinFailed);
      }
    } catch {
      setJoinStatus(t.joinFailedNetwork);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="glass-premium p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20 text-red-400">
          <ShieldAlert size={28} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black uppercase italic text-white">{t.authRequired}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 max-w-xs mx-auto leading-relaxed">
            {t.authDesc}
          </p>
        </div>
      </div>
    );
  }

  // If a group is selected, show the leaderboard detail view
  if (selectedGroupId) {
    return (
      <div className="glass-premium p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <button 
            onClick={() => { setSelectedGroupId(null); setSelectedGroupDetail(null); }}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white/50 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer bg-transparent border-none outline-none"
          >
            ← {locale === 'es' ? 'Volver a Grupos' : 'Back to Groups'}
          </button>
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">
            {locale === 'es' ? 'Identificador' : 'ID'}: {selectedGroupId.slice(-8)}
          </span>
        </div>

        {loadingDetail ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40 animate-pulse">
              {locale === 'es' ? 'Cargando Tabla...' : 'Loading Leaderboard...'}
            </span>
          </div>
        ) : detailError ? (
          <div className="text-center py-12 space-y-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl max-w-sm mx-auto">
              {detailError}
            </div>
            <button
              onClick={() => fetchGroupDetail(selectedGroupId)}
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
            >
              {locale === 'es' ? 'Reintentar' : 'Retry'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Group Meta Info */}
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-wide text-white">
                  {selectedGroupDetail?.group?.name}
                </h3>
                <p className="text-[9px] font-mono text-white/40 uppercase mt-1">
                  {locale === 'es' ? 'Líder' : 'Leader'}: {selectedGroupDetail?.group?.ownerWallet.slice(0, 6)}...{selectedGroupDetail?.group?.ownerWallet.slice(-6)}
                </p>
              </div>
              <div className="bg-[#060D1A] border border-white/5 rounded-xl px-4 py-3 text-center sm:text-right shrink-0">
                <span className="block text-[8px] font-black uppercase tracking-widest text-white/40">
                  {locale === 'es' ? 'CÓDIGO DE INVITACIÓN' : 'INVITE CODE'}
                </span>
                <span className="block text-sm font-black text-primary tracking-wider mt-1 select-all">
                  {selectedGroupDetail?.group?.inviteCode}
                </span>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="space-y-4">
              <h4 className="text-[9px] font-black uppercase tracking-wider text-white/40 border-b border-white/5 pb-2">
                {locale === 'es' ? 'Clasificación de Miembros' : 'Member Standings'}
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">
                      <th className="py-2.5 px-2">#</th>
                      <th className="py-2.5 px-2">{locale === 'es' ? 'Pronosticador' : 'Predictor'}</th>
                      <th className="py-2.5 px-2 text-right">{locale === 'es' ? 'Puntos' : 'Points'}</th>
                      <th className="py-2.5 px-2 text-right hidden sm:table-cell">{locale === 'es' ? 'Nivel' : 'Level'}</th>
                      <th className="py-2.5 px-2 text-right hidden sm:table-cell">{locale === 'es' ? 'Exactas' : 'Exact'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {selectedGroupDetail?.leaderboard.map((member, idx) => {
                      const isMe = member.walletAddress === user?.walletAddress;
                      const shortAddress = `${member.walletAddress.slice(0, 4)}...${member.walletAddress.slice(-4)}`;
                      const displayName = member.displayName || shortAddress;
                      const rank = idx + 1;

                      return (
                        <tr 
                          key={member.walletAddress} 
                          className={`hover:bg-white/[0.02] transition-colors ${isMe ? 'bg-primary/5 text-primary' : 'text-white/80'}`}
                        >
                          <td className="py-3 px-2 font-black text-[11px] text-white/50">
                            #{rank}
                          </td>
                          <td className="py-3 px-2">
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{displayName}</span>
                              {isMe && (
                                <span className="text-[7px] bg-primary text-midnight px-1 rounded font-black uppercase tracking-wider">
                                  {locale === 'es' ? 'Tú' : 'You'}
                                </span>
                              )}
                            </div>
                            <span className="block text-[8px] font-mono text-white/30 uppercase mt-0.5 sm:hidden">
                              {locale === 'es' ? 'Nivel' : 'Lvl'} {member.level}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right font-black text-sm text-white">
                            {member.totalPoints}
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-white/50 hidden sm:table-cell">
                            {member.level}
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-white/50 hidden sm:table-cell">
                            {member.totalCorrect}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-premium p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8">
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-primary">
          <Users size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.title}</span>
        </div>
        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{t.activeNode}: {user?.walletAddress.slice(-8)}</span>
      </div>

      {/* Creation Segment */}
      <div className="space-y-4">
        <h4 className="text-[9px] font-black uppercase tracking-wider text-white/40">{t.createTitle}</h4>
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-primary outline-none transition-all placeholder:text-white/20"
            placeholder={t.placeholderCreate} 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <button 
            className="px-6 py-2 rounded-xl bg-primary text-midnight font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform cursor-pointer" 
            onClick={create} 
            disabled={creating}
          >
            <Plus size={14} /> {creating ? '...' : t.btnCreate}
          </button>
        </div>
        {created && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-xl flex items-center gap-2 uppercase tracking-wide">
            <Check size={12} /> {t.successCreated}: {created.name} ({locale === 'es' ? 'Código' : 'Code'}: {created.inviteCode})
          </div>
        )}
      </div>

      {/* Joining Segment */}
      <div className="space-y-4">
        <h4 className="text-[9px] font-black uppercase tracking-wider text-white/40">{t.inviteLabel}</h4>
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-primary outline-none transition-all placeholder:text-white/20"
            placeholder={t.placeholderJoin} 
            value={joinCode} 
            onChange={e => setJoinCode(e.target.value.toUpperCase())} 
          />
          <button 
            className="px-6 py-2 rounded-xl bg-primary text-midnight font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform cursor-pointer" 
            onClick={join}
          >
            <Key size={14} /> {t.btnJoin}
          </button>
        </div>
        {joinStatus && (
          <div className="p-3 bg-white/5 border border-white/10 text-white/80 text-[10px] font-bold rounded-xl uppercase tracking-wide">
            {joinStatus}
          </div>
        )}
      </div>

      {/* Active Groups List */}
      <div className="space-y-4">
        <h4 className="text-[9px] font-black uppercase tracking-wider text-white/40 border-b border-white/5 pb-2">{t.channelsTitle} ({groups.length})</h4>
        <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {groups.length === 0 ? (
            <div className="text-center py-6 text-white/20 text-[9px] font-black uppercase tracking-widest italic">
              {t.noChannels}
            </div>
          ) : (
            groups.map(g => (
              <div 
                key={g.id} 
                onClick={() => handleSelectGroup(g.id)}
                className="p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group"
              >
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-white group-hover:text-primary transition-colors">{g.name}</div>
                  <div className="text-[8px] font-mono text-white/30 uppercase mt-0.5">{locale === 'es' ? 'Código' : 'Code'}: {g.inviteCode}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-lg uppercase">
                    {g.members?.length || 1} {t.membersCount}
                  </span>
                  <span className="text-[9px] font-bold text-white/30 group-hover:text-white transition-colors">→</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
