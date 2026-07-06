import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { getActiveEnrollmentForBlock, getBlockProgress, setBlockProgress } from '@/lib/db/progress';
import { setBlockProgressSchema } from '@/lib/schemas/progress';
import { requireSession } from '@/lib/session';

interface RouteParams {
  params: Promise<{ blockId: string }>;
}

const ERROR_STATUS = {
  block_not_found: 404,
  course_not_found: 404,
  not_enrolled: 403,
} as const;

const ERROR_MESSAGE = {
  block_not_found: 'Block nicht gefunden',
  course_not_found: 'Kurs nicht gefunden',
  not_enrolled: 'Keine aktive Einschreibung',
} as const;

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { blockId } = await params;
    const session = await requireSession();
    const result = await getActiveEnrollmentForBlock(session.userId, blockId, session.orgId);
    if ('error' in result) {
      return NextResponse.json(
        { error: ERROR_MESSAGE[result.error] },
        { status: ERROR_STATUS[result.error] },
      );
    }

    const progress = await getBlockProgress(result.enrollment.id, blockId);
    return NextResponse.json(progress ?? { status: 'not_started' });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { blockId } = await params;
    const session = await requireSession();
    const body = await request.json();
    const input = setBlockProgressSchema.parse(body);

    const result = await getActiveEnrollmentForBlock(session.userId, blockId, session.orgId);
    if ('error' in result) {
      return NextResponse.json(
        { error: ERROR_MESSAGE[result.error] },
        { status: ERROR_STATUS[result.error] },
      );
    }

    const updated = await setBlockProgress(result.enrollment.id, blockId, result.courseId, input);
    return NextResponse.json(updated);
  } catch (error) {
    return toErrorResponse(error);
  }
}
