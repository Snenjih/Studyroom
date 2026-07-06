import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { createCourse, listCoursesByProgram } from '@/lib/db/courses';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { createCourseSchema } from '@/lib/schemas/course';
import { requireSession } from '@/lib/session';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id: programId } = await params;
  const session = await requireSession();
  const courseList = await listCoursesByProgram(programId, session.orgId);
  return NextResponse.json(courseList);
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: programId } = await params;
    const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
    const body = await request.json();
    const input = createCourseSchema.parse(body);
    const result = await createCourse(programId, session.orgId, input);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    return NextResponse.json(result.course, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
