import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { deleteBlock, updateBlock, updateBlockPosition } from '@/lib/db/courses';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { updateBlockPositionSchema, updateBlockSchema } from '@/lib/schemas/course';

interface RouteParams {
  params: Promise<{ id: string; blockId: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, blockId } = await params;
    const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
    const body = await request.json();
    const input = updateBlockSchema.parse(body);
    const block = await updateBlock(id, blockId, session.orgId, input);
    if (!block) {
      return NextResponse.json({ error: 'Block nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(block);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, blockId } = await params;
    const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
    const body = await request.json();
    const { position } = updateBlockPositionSchema.parse(body);
    const block = await updateBlockPosition(id, blockId, session.orgId, position);
    if (!block) {
      return NextResponse.json({ error: 'Block nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(block);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id, blockId } = await params;
    const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
    const block = await deleteBlock(id, blockId, session.orgId);
    if (!block) {
      return NextResponse.json({ error: 'Block nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(block);
  } catch (error) {
    return toErrorResponse(error);
  }
}
