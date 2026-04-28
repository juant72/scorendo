// Lightweight in-memory groups service for MVP social prediction groups
export type Group = {
  id: string;
  name: string;
  inviteCode: string;
  ownerWallet: string;
  members: string[]; // wallet addresses
  createdAt: Date;
};

const groups: Group[] = [];

export function generateInviteCode(): string {
  // 6-char alphanumeric
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function createGroup(ownerWallet: string, name: string): Group {
  const g: Group = {
    id: 'grp_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
    name,
    inviteCode: generateInviteCode(),
    ownerWallet,
    members: [ownerWallet],
    createdAt: new Date()
  };
  groups.push(g);
  return g;
}

export function joinGroup(inviteCode: string, wallet: string): { success: boolean; group?: Group; error?: string } {
  const g = groups.find(gr => gr.inviteCode === inviteCode);
  if (!g) return { success: false, error: 'Group not found' };
  if (!g.members.includes(wallet)) {
    g.members.push(wallet);
  }
  return { success: true, group: g };
}

export function listGroups(): Group[] {
  return groups;
}
