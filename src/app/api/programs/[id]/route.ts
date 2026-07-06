import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { deleteProgram, getProgram, updateProgram } from '@/lib/db/programs';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { updateProgramSchema } from '@/lib/schemas/program';
import { requireSession } from '@/lib/session';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const session = await requireSession();
  const program = await getProgram(id, session.orgId);
  if (!program) {
    return NextResponse.json({ error: 'Program nicht gefunden' }, { status: 404 });
  }
  return NextResponse.json(program);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requirePermission(PERMISSIONS.PROGRAMS_MANAGE);
    const body = await request.json();
    const input = updateProgramSchema.parse(body);
    const program = await updateProgram(id, session.orgId, input);
    if (!program) {
      return NextResponse.json({ error: 'Program nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(program);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requirePermission(PERMISSIONS.PROGRAMS_MANAGE);
    const program = await deleteProgram(id, session.orgId);
    if (!program) {
      return NextResponse.json({ error: 'Program nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(program);
  } catch (error) {
    return toErrorResponse(error);
  }
}
