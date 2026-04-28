"use client";
import React, { useEffect, useState } from 'react';

type Group = { id: string; name: string; inviteCode: string; ownerWallet: string; members: string[] };

export function GroupsPanel() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState('New Group');
  const [owner, setOwner] = useState('');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<Group | null>(null);

  useEffect(() => {
    fetch('/api/groups/list')
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
      const res = await fetch('/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerWallet: owner, name }),
      });
      const data = await res.json();
      if (data.success) {
        const g = { id: data.groupId, name, inviteCode: data.inviteCode, ownerWallet: owner, members: [owner] } as Group;
        setCreated(g);
        setGroups(prev => [...prev, g]);
      }
    } finally {
      setCreating(false);
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
            <span className="font-mono">{g.name}</span> - Invite: {g.inviteCode} - Members: {g.members.length}
          </div>
        ))}
      </div>
    </div>
  );
}
