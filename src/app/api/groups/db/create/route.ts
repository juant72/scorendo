import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInviteCode } from '@/lib/groups';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    const ownerWallet = session?.wallet as string | undefined;
    
    if (!ownerWallet) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (!name) {
      return NextResponse.json({ success: false, error: 'Missing name' }, { status: 400 });
    }
    
    const invite = generateInviteCode();
    const group = await prisma.socialGroup.create({
      data: { 
        name, 
        ownerWallet, 
        inviteCode: invite,
        members: {
          create: {
            userWallet: ownerWallet
          }
        }
      }
    });
    return NextResponse.json({ success: true, groupId: group.id, inviteCode: invite });
  } catch (e) {
    console.error('Create group error:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
