"use client";
import React, { useEffect, useState } from 'react';

type Group = { id: string; name: string; inviteCode: string; ownerWallet: string; members: { userWallet: string }[] };

export function GroupsPanel() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState('My Group');
  const [owner, setOwner] = useState('DemoWallet123');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<Group | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinStatus, setJoinStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/groups/db/list')
      .then(r => r.json())
      .then((data) => {
        if (data?.groups) setGroups(data.groups);
      })
      .catch(() => {});
  }, []);

const create = async () => {
    if (!name || !owner) return;
    setCreating(true);
    try {
      const res = await fetch('/api/groups/db/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, wallet: owner }),
      });
      const data = await res.json();
      if (data.success) {
        const g = { id: data.groupId, name, inviteCode: data.inviteCode, ownerWallet: owner, members: [{ userWallet: owner }] } as Group;
        setCreated(g);
        setGroups(prev => [...prev, g]);
      }
    } finally {
      setCreating(false);
    }
  };

const join = async () => {
    if (!joinCode || !owner) return;
    setJoinStatus(null);
    try {
      const res = await fetch('/api/groups/db/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: joinCode, wallet: owner }),
      });
      const data = await res.json();
      if (data.success) {
        setJoinStatus('Joined group');
        const r = await fetch('/api/groups/db/list');
        const list = await r.json();
        if (list?.groups) setGroups(list.groups);
      } else {
        setJoinStatus(data.error || 'Join failed');
      }
    } catch {
      setJoinStatus('Join failed (network)');
    }
  };

  return (
    <div className="glass-premium p-6 rounded-2xl border border-white/5">
      <h3 className="text-sm font-black uppercase tracking-widest">Groups</h3>
      <div className="mt-2 flex gap-2">
        <input className="border rounded px-3 py-2 text-sm" placeholder="Group name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Owner wallet" value={owner} onChange={e => setOwner(e.target.value)} />
        <button className="px-4 py-2 rounded bg-primary text-midnight font-black" onClick={create} disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
      </div>
      {created && (
        <div className="mt-2 text-xs text-green-400">Group created: {created.name} (Invite: {created.inviteCode})</div>
      )}
<div className="mt-4 max-h-40 overflow-auto border-t pt-2">
        {groups.map(g => (
          <div key={g.id} className="py-1 text-xs">
            <span className="font-mono">{g.name}</span> - Invite: {g.inviteCode} - Members: {g.members?.length || 0}
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 border-t border-white/10 flex flex-col gap-2">
        <div className="text-xs uppercase tracking-widest text-white/70">Join by Invite Code</div>
        <div className="flex items-center gap-2">
          <input className="border rounded px-3 py-2 text-sm" placeholder="Invite Code" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} />
          <button className="px-4 py-2 rounded bg-primary text-midnight font-black" onClick={join}>Join</button>
        </div>
        {joinStatus && <div className="text-xs text-white/80">{joinStatus}</div>}
      </div>
    </div>
  );
}
