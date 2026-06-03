'use client';
import React from 'react';
import { GroupsPanel } from '@/components/groups/GroupsPanel';
import { locales } from '@/lib/locales';
import { useAuthStore } from '@/store/useAuthStore';

export default function GroupsPage(){
  const { locale } = useAuthStore();
  const t = locales[locale].groups;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black uppercase italic tracking-tight">{t.title}</h1>
      <GroupsPanel />
    </div>
  );
}
