import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

/**
 * GET /api/admin/users
 * High-performance fetch for user intelligence metrics.
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Advanced User Query — Including recent activity and scale
    const users = await prisma.user.findMany({
      take: 100, // Limit for performance
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { predictions: true, transactions: true }
        }
      }
    });

    // Stats aggregation logic for the Dashboard meta-data
    const totalUsers = await prisma.user.count();
    const activeToday = await prisma.user.count({
      where: { updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
    });

    return NextResponse.json({ 
      success: true, 
      users,
      stats: { totalUsers, activeToday }
    });

  } catch (error: any) {
    console.error('Admin Users API Failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
