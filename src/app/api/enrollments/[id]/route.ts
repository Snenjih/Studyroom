import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { getEnrollment, unenrollUser } from '@/lib/db/enrollments';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission, requirePermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Eigentümer sieht/verwaltet die eigene Einschreibung ohne besondere Permission;
// für fremde Einschreibungen ist `enrollments:manage` (Trainer/Admin) nötig.
async function assertCanAccessEnrollment(
  enrollmentUserId: string,
  sessionUserId: string,
): Promise<void> {
  if (enrollmentUserId === sessionUserId) return;
  await requirePermission(PERMISSIONS.ENROLLMENTS_MANAGE);
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requireSession();
    const enrollment = await getEnrollment(id, session.orgId);
    if (!enrollment) {
      return NextResponse.json({ error: 'Einschreibung nicht gefunden' }, { status: 404 });
    }
    if (enrollment.userId !== session.userId) {
      const allowed = await hasPermission(session.userId, PERMISSIONS.ENROLLMENTS_MANAGE);
      if (!allowed) {
        return NextResponse.json({ error: 'Fehlende Permission' }, { status: 403 });
      }
    }
    return NextResponse.json(enrollment);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requireSession();
    const enrollment = await getEnrollment(id, session.orgId);
    if (!enrollment) {
      return NextResponse.json({ error: 'Einschreibung nicht gefunden' }, { status: 404 });
    }
    await assertCanAccessEnrollment(enrollment.userId, session.userId);

    const updated = await unenrollUser(id, session.orgId);
    return NextResponse.json(updated);
  } catch (error) {
    return toErrorResponse(error);
  }
}
