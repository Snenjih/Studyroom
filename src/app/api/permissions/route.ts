import { NextResponse } from 'next/server';

import { listAssignablePermissions } from '@/lib/db/permissions';
import { requireSession } from '@/lib/session';

export async function GET() {
  await requireSession();
  const permissionsList = await listAssignablePermissions();
  return NextResponse.json(permissionsList);
}
