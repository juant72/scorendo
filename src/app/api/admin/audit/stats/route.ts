import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    
    if (!session?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    const stats = await prisma.transaction.groupBy({
      by: ['type'],
      _sum: {
        amount: true
      },
      where: {
        status: 'CONFIRMED'
      }
    });

    // 2. Fetch Recent Admin Activity
    const recentLogs = await prisma.adminLog.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 3. Fetch Transaction Volume
    const txCount = await prisma.transaction.count({
      where: { status: 'CONFIRMED' }
    });

    // Format BigInts for JSON
    const formattedStats = stats.reduce((acc: any, curr: any) => {
      acc[curr.type] = curr._sum.amount?.toString() || '0';
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      stats: {
        prizes: formattedStats['PRIZE_PAYOUT'] || '0',
        revenue: formattedStats['ORG_CUT'] || '0',
        entryFees: formattedStats['ENTRY_FEE'] || '0',
        totalTransactions: txCount
      },
      auditTrail: recentLogs
    });

  } catch (error: any) {
    console.error('Audit Fetch Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch audit stats' 
    }, { status: 500 });
  }
}
