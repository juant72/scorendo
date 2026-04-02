import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import crypto from 'crypto';

/**
 * POST /api/contests/create-private
 * Deep clones a template contest into a private corporate league.
 * Includes branding and auto-join for the creator.
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.wallet) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId, customName, customLogoUrl } = await req.json();

    if (!templateId || !customName) {
      return NextResponse.json({ success: false, error: 'Bad Request' }, { status: 400 });
    }

    // 1. Fetch Template
    const template = await prisma.contest.findUnique({ where: { id: templateId } });
    if (!template || template.isPrivate) {
      return NextResponse.json({ success: false, error: 'Template not found or ineligible' }, { status: 404 });
    }

    // 2. SAFETY CHECK: Check earliest kickoff (Buffer 1 hour)
    const matches = await prisma.match.findMany({
       where: { phaseId: template.phaseId || undefined },
       orderBy: { kickoff: 'asc' }
    });

    if (matches.length > 0) {
      const earliestKickoff = matches[0].kickoff.getTime();
      const now = Date.now();
      const ONE_HOUR = 60 * 60 * 1000;

      if (now > (earliestKickoff - ONE_HOUR)) {
        return NextResponse.json({ 
          success: false, 
          error: 'LOCKED: Template starts in less than 1 hour. Teammates need time to join.' 
        }, { status: 403 });
      }
    }

    // 3. Create Private Clone
    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const uniqueSlug = `${template.slug}-private-${crypto.randomBytes(3).toString('hex')}`;

    const newContest = await prisma.contest.create({
      data: {
        name: customName,
        slug: uniqueSlug,
        description: `Private league based on ${template.name}`,
        type: template.type,
        tier: 'FREE', // Private corporate leagues are free by default
        entryFeeSOL: 0,
        prizePool: BigInt(0),
        distribution: template.distribution as any,
        tournamentId: template.tournamentId,
        phaseId: template.phaseId,
        startDate: template.startDate,
        endDate: template.endDate,
        registrationEnd: template.registrationEnd,
        status: 'REGISTRATION',
        isPrivate: true,
        inviteCode,
        customBrandName: customName,
        customLogoUrl: customLogoUrl || '/branding/default-corporate.png',
        
        // Auto-join the creator
        entries: {
          create: {
            userWallet: session.wallet,
            entryPaid: true,
            isFreeEntry: true,
            entryPaidAt: new Date()
          }
        }
      }
    });

    return NextResponse.json({ success: true, contest: newContest });

  } catch (error) {
    console.error('Create Private Contest Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
