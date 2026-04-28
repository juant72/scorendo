import { NextResponse } from 'next/server';
import { createGroup } from '@/lib/groups';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ownerWallet, name } = body;
    if (!ownerWallet || !name) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    const group = createGroup(ownerWallet, name);
    return NextResponse.json({ success: true, groupId: group.id, inviteCode: group.inviteCode });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
