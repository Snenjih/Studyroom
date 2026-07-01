import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { getActiveEnrollmentForCourse, getCourseProgress } from '@/lib/db/progress';
import { requireSession } from '@/lib/session';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const ERROR_STATUS = {
  course_not_found: 404,
  not_enrolled: 403,
} as const;

const ERROR_MESSAGE = {
  course_not_found: 'Kurs nicht gefunden',
  not_enrolled: 'Keine aktive Einschreibung',
} as const;

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requireSession();
    const result = await getActiveEnrollmentForCourse(session.userId, id, session.orgId);
    if ('error' in result) {
      return NextResponse.json(
        { error: ERROR_MESSAGE[result.error] },
        { status: ERROR_STATUS[result.error] },
      );
    }

    const progressPercent = await getCourseProgress(id, result.enrollment.id);
    return NextResponse.json({ progressPercent });
  } catch (error) {
    return toErrorResponse(error);
  }
}
