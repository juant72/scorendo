import { NextResponse } from 'next/server';
import { joinGroup } from '@/lib/groups';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { inviteCode, wallet } = body;
    if (!inviteCode || !wallet) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    const result = joinGroup(inviteCode, wallet);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, group: result.group });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
