import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');

    if (!groupId) {
      return NextResponse.json({ success: false, error: 'groupId query parameter is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    const userWallet = session?.wallet as string | undefined;

    if (!userWallet) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a member of the group
    const membership = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userWallet
      }
    });

    if (!membership) {
      return NextResponse.json({ success: false, error: 'Forbidden: You are not a member of this group' }, { status: 403 });
    }

    // Fetch group details along with members
    const group = await prisma.socialGroup.findUnique({
      where: { id: groupId },
      include: {
        members: {
          orderBy: { joinedAt: 'asc' }
        }
      }
    });

    if (!group) {
      return NextResponse.json({ success: false, error: 'Group not found' }, { status: 404 });
    }

    // Fetch profiles of all members to build the leaderboard
    const memberWallets = group.members.map(m => m.userWallet);
    const users = await prisma.user.findMany({
      where: {
        walletAddress: { in: memberWallets }
      },
      select: {
        walletAddress: true,
        displayName: true,
        totalPoints: true,
        totalCorrect: true,
        accuracy: true,
        level: true
      }
    });

    // Merge joining dates and sort by totalPoints desc
    const leaderboard = users.map(u => {
      const memberRecord = group.members.find(m => m.userWallet === u.walletAddress);
      return {
        ...u,
        joinedAt: memberRecord?.joinedAt || new Date()
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);

    return NextResponse.json({
      success: true,
      group: {
        id: group.id,
        name: group.name,
        inviteCode: group.inviteCode,
        ownerWallet: group.ownerWallet,
        createdAt: group.createdAt,
      },
      leaderboard
    });
  } catch (e) {
    console.error('Fetch group detail error:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
