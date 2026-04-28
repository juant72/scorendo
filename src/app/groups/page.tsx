'use client';
import React from 'react';
import { GroupsPanel } from '@/components/groups/GroupsPanel';

export default function GroupsPage(){
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black">Groups & Collaboration</h1>
      <GroupsPanel />
    </div>
  );
}
