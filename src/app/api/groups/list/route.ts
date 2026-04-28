import { NextResponse } from 'next/server';
import { listGroups } from '@/lib/groups';

export async function GET() {
  const groups = listGroups();
  return NextResponse.json({ success: true, groups });
}
