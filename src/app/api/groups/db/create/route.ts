import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInviteCode } from '@/lib/groups';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;
    // Authenticate user via session cookie and derive ownerWallet
    const cookieModule: any = await import('next/headers');
    const cookieStore = cookieModule.cookies ? cookieModule.cookies() : null;
    const token = cookieStore?.get('scorendo_session')?.value;
    const { verifySessionToken } = await import('@/lib/auth');
    const session = token ? await verifySessionToken(token) : null;
    const ownerWallet = (session?.wallet as string) || undefined;
    if (!ownerWallet || !name) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    // Create group without inviteCode first to satisfy Prisma types, then assign inviteCode
    const group: any = await (prisma as any).group.create({ data: { name } });
    const invite = generateInviteCode();
    await (prisma as any).group.update({ where: { id: group.id }, data: { inviteCode: invite } });
    await (prisma as any).groupMember.create({ data: { groupId: group.id, userWallet: ownerWallet } }).catch(() => {});
    return NextResponse.json({ success: true, groupId: group.id, inviteCode: invite });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
