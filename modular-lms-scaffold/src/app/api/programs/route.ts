import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { createProgram, listPrograms } from '@/lib/db/programs';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { createProgramSchema } from '@/lib/schemas/program';
import { requireSession } from '@/lib/session';

export async function GET() {
  const session = await requireSession();
  const programList = await listPrograms(session.orgId);
  return NextResponse.json(programList);
}

export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.PROGRAMS_MANAGE);
    const body = await request.json();
    const input = createProgramSchema.parse(body);
    const program = await createProgram(session.orgId, input);
    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
