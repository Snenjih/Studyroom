import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { listEnrollmentsForCourse } from '@/lib/db/enrollments';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requirePermission(PERMISSIONS.ENROLLMENTS_MANAGE);
    const enrollments = await listEnrollmentsForCourse(id, session.orgId);
    if (!enrollments) {
      return NextResponse.json({ error: 'Kurs nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(enrollments);
  } catch (error) {
    return toErrorResponse(error);
  }
}
