import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session?.wallet) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { inviteCode, wallet } = await req.json();
    const g: any = await (prisma as any).group.findFirst({ where: { inviteCode }, include: { invites: true } });
    if (!g) return NextResponse.json({ success: false, error: 'Group not found' }, { status: 404 });
    await (prisma as any).groupMember.create({ data: { groupId: g.id, userWallet: wallet } }).catch(() => {});
    return NextResponse.json({ success: true, groupId: g.id });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
