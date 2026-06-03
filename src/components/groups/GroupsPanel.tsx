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

  const fetchGroups = async () => {
    try {
      const r = await fetch('/api/groups/db/list');
      const data = await r.json();
      if (data?.groups) setGroups(data.groups);
    } catch (e) {
      console.error(e);
    }
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
            className="px-6 py-2 rounded-xl bg-primary text-midnight font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform" 
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
            className="px-6 py-2 rounded-xl bg-primary text-midnight font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform" 
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
              <div key={g.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-white">{g.name}</div>
                  <div className="text-[8px] font-mono text-white/30 uppercase mt-0.5">{locale === 'es' ? 'Código' : 'Code'}: {g.inviteCode}</div>
                </div>
                <span className="text-[9px] font-black bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-lg uppercase">
                  {g.members?.length || 1} {t.membersCount}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
