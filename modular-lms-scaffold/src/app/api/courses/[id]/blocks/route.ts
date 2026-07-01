import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { createBlock, listBlocks } from '@/lib/db/courses';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { createBlockSchema } from '@/lib/schemas/course';
import { requireSession } from '@/lib/session';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const session = await requireSession();
  const blocks = await listBlocks(id, session.orgId);
  if (!blocks) {
    return NextResponse.json({ error: 'Kurs nicht gefunden' }, { status: 404 });
  }
  return NextResponse.json(blocks);
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
    const body = await request.json();
    const input = createBlockSchema.parse(body);
    const block = await createBlock(id, session.orgId, input);
    if (!block) {
      return NextResponse.json({ error: 'Kurs nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
