import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { deleteCourse, getCourseWithBlocks, updateCourse } from '@/lib/db/courses';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { updateCourseSchema } from '@/lib/schemas/course';
import { requireSession } from '@/lib/session';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const session = await requireSession();
  const course = await getCourseWithBlocks(id, session.orgId);
  if (!course) {
    return NextResponse.json({ error: 'Kurs nicht gefunden' }, { status: 404 });
  }
  return NextResponse.json(course);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
    const body = await request.json();
    const input = updateCourseSchema.parse(body);
    const result = await updateCourse(id, session.orgId, input);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    return NextResponse.json(result.course);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
    const course = await deleteCourse(id, session.orgId);
    if (!course) {
      return NextResponse.json({ error: 'Kurs nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    return toErrorResponse(error);
  }
}
