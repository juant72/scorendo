import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInviteCode } from '@/lib/groups';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ownerWallet, name } = body;
    if (!ownerWallet || !name) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    const group = await prisma.group.create({ data: { name, inviteCode: generateInviteCode(), ownerWallet } });
    // Add owner as member
    await prisma.groupMember.create({ data: { groupId: group.id, userWallet: ownerWallet } }).catch(() => {});
    return NextResponse.json({ success: true, groupId: group.id, inviteCode: group.inviteCode });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
