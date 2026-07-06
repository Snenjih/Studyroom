import 'server-only';

import { and, count, eq, inArray } from 'drizzle-orm';

import { db } from '@/db';
import { blockProgress, contentBlocks, courses, enrollments, programs } from '@/db/schema';

import { courseBelongsToOrg } from './courses';
import { upsertBlockProgress, type UpsertBlockProgressInput } from './enrollments';

export async function getBlockProgress(enrollmentId: string, blockId: string) {
  const [row] = await db
    .select()
    .from(blockProgress)
    .where(and(eq(blockProgress.enrollmentId, enrollmentId), eq(blockProgress.blockId, blockId)))
    .limit(1);
  return row ?? null;
}

// Prozentzahl 0-100: Anteil der Blöcke mit Status `done` ODER `failed` (= bearbeitet)
// an allen Blöcken des Kurses (T022-Vorgabe).
export async function getCourseProgress(courseId: string, enrollmentId: string): Promise<number> {
  const [totalRow] = await db
    .select({ total: count() })
    .from(contentBlocks)
    .where(eq(contentBlocks.courseId, courseId));
  const total = totalRow?.total ?? 0;
  if (total === 0) return 0;

  const doneOrFailedRows = await db
    .select({ status: blockProgress.status })
    .from(blockProgress)
    .where(eq(blockProgress.enrollmentId, enrollmentId));
  const handled = doneOrFailedRows.filter(
    (row) => row.status === 'done' || row.status === 'failed',
  ).length;

  return Math.round((handled / total) * 100);
}

// Vollständig abgeschlossen ist ein Kurs erst, wenn ALLE Blöcke `done` sind (nicht
// `failed`) — setzt dann `enrollments.completed_at` und Status `completed`. Fällt ein
// zuvor abgeschlossener Kurs unter 100% zurück (z.B. ein Block wird erneut bearbeitet
// und schlägt fehl, oder ein Trainer ergänzt nachträglich einen neuen Block), wird der
// Completion-Status wieder zurückgenommen statt veraltet stehen zu bleiben.
async function checkCourseCompletion(enrollmentId: string, courseId: string) {
  const [totalRow] = await db
    .select({ total: count() })
    .from(contentBlocks)
    .where(eq(contentBlocks.courseId, courseId));
  const total = totalRow?.total ?? 0;
  if (total === 0) return;

  const [doneRow] = await db
    .select({ done: count() })
    .from(blockProgress)
    .where(and(eq(blockProgress.enrollmentId, enrollmentId), eq(blockProgress.status, 'done')));
  const done = doneRow?.done ?? 0;

  const [enrollment] = await db
    .select({ status: enrollments.status })
    .from(enrollments)
    .where(eq(enrollments.id, enrollmentId))
    .limit(1);
  if (!enrollment) return;

  if (done >= total && enrollment.status !== 'completed') {
    await db
      .update(enrollments)
      .set({ status: 'completed', completedAt: new Date() })
      .where(eq(enrollments.id, enrollmentId));
  } else if (done < total && enrollment.status === 'completed') {
    await db
      .update(enrollments)
      .set({ status: 'active', completedAt: null })
      .where(eq(enrollments.id, enrollmentId));
  }
}

export async function setBlockProgress(
  enrollmentId: string,
  blockId: string,
  courseId: string,
  input: UpsertBlockProgressInput,
) {
  const updated = await upsertBlockProgress(enrollmentId, blockId, input);
  await checkCourseCompletion(enrollmentId, courseId);
  return updated;
}

export type EnrollmentAccessError = 'course_not_found' | 'not_enrolled';

// Ermittelt die zugreifbare Einschreibung des angemeldeten Nutzers für einen Kurs,
// org-scoped über den Course. `active` UND `completed` gelten als zugreifbar — sonst
// könnte ein Lernender den eigenen Fortschritt nicht mehr einsehen, sobald der Kurs
// fertig ist. Nur explizit ausgetragene (`inactive`/`dropped`) Einschreibungen sind
// gesperrt (T021/T022-Abnahme: "Kein Progress ohne aktive Einschreibung").
export const ACCESSIBLE_ENROLLMENT_STATUSES = ['active', 'completed'] as const;

export async function getActiveEnrollmentForCourse(
  userId: string,
  courseId: string,
  orgId: string,
): Promise<{ error: EnrollmentAccessError } | { enrollment: typeof enrollments.$inferSelect }> {
  if (!(await courseBelongsToOrg(courseId, orgId))) {
    return { error: 'course_not_found' };
  }

  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId),
        inArray(enrollments.status, ACCESSIBLE_ENROLLMENT_STATUSES),
      ),
    )
    .limit(1);

  if (!enrollment) return { error: 'not_enrolled' };
  return { enrollment };
}

export async function getActiveEnrollmentForBlock(
  userId: string,
  blockId: string,
  orgId: string,
): Promise<
  | { error: EnrollmentAccessError | 'block_not_found' }
  | { enrollment: typeof enrollments.$inferSelect; courseId: string }
> {
  const [row] = await db
    .select({ courseId: contentBlocks.courseId })
    .from(contentBlocks)
    .innerJoin(courses, eq(contentBlocks.courseId, courses.id))
    .innerJoin(programs, eq(courses.programId, programs.id))
    .where(and(eq(contentBlocks.id, blockId), eq(programs.orgId, orgId)))
    .limit(1);
  if (!row) return { error: 'block_not_found' };

  const result = await getActiveEnrollmentForCourse(userId, row.courseId, orgId);
  if ('error' in result) return result;
  return { enrollment: result.enrollment, courseId: row.courseId };
}
