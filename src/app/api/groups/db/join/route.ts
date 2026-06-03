import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { inviteCode } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    const userWallet = session?.wallet as string | undefined;

    if (!userWallet) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!inviteCode) {
      return NextResponse.json({ success: false, error: 'Missing invite code' }, { status: 400 });
    }

    // 1. Find group by inviteCode (check both SocialGroup inviteCode field and GroupInvite table)
    let group = await prisma.socialGroup.findUnique({
      where: { inviteCode }
    });

    if (!group) {
      const invite = await prisma.groupInvite.findUnique({
        where: { code: inviteCode },
        include: { group: true }
      });
      if (invite) {
        // Optionally check expiration
        if (invite.expiresAt && new Date() > invite.expiresAt) {
          return NextResponse.json({ success: false, error: 'Invite code expired' }, { status: 400 });
        }
        group = invite.group;
      }
    }

    if (!group) {
      return NextResponse.json({ success: false, error: 'Group not found' }, { status: 404 });
    }

    // 2. Check if user is already a member
    const existingMember = await prisma.groupMember.findFirst({
      where: {
        groupId: group.id,
        userWallet
      }
    });

    if (existingMember) {
      return NextResponse.json({ success: true, groupId: group.id, message: 'Already a member' });
    }

    // 3. Add user to the group
    await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userWallet
      }
    });

    return NextResponse.json({ success: true, groupId: group.id });
  } catch (e) {
    console.error('Join group error:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
