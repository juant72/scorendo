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
    
    const teams = await prisma.team.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        code: true,
        flagUrl: true
      }
    });

    return NextResponse.json({
      success: true,
      teams
    });

  } catch (error: any) {
    console.error('Fetch Teams Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch teams' 
    }, { status: 500 });
  }
}