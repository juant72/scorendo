import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    const { inviteCode, wallet } = await req.json();
    const userWallet = wallet || (session?.wallet as string) || undefined;
    if (!userWallet) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const g = await prisma.socialGroup.findFirst({ where: { inviteCode }, include: { invites: true } });
    if (!g) return NextResponse.json({ success: false, error: 'Group not found' }, { status: 404 });
    await prisma.groupMember.create({ data: { groupId: g.id, userWallet } }).catch(() => {});
    return NextResponse.json({ success: true, groupId: g.id });
  } catch (e) {
    console.error('Join group error:', e);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
