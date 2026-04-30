import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInviteCode } from '@/lib/groups';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, wallet } = body;
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    const ownerWallet = wallet || (session?.wallet as string) || undefined;
    if (!ownerWallet || !name) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    const invite = generateInviteCode();
    const group = await prisma.socialGroup.create({
      data: { name, ownerWallet, inviteCode: invite }
    });
    return NextResponse.json({ success: true, groupId: group.id, inviteCode: invite });
  } catch (e) {
    console.error('Create group error:', e);
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
