import 'server-only';

import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import {
  blockProgress,
  type BlockProgressStatus,
  contentBlocks,
  courses,
  enrollments,
  programs,
  users,
} from '@/db/schema';

import { courseBelongsToOrg } from './courses';

// Minimale Lese/Schreib-Helfer, die T018-T020 (Lern-Erlebnis pro Course-Type)
// brauchen, um Fortschritt zu speichern. Die vollständige Enrollments-Verwaltung
// (einschreiben/austragen/Status wechseln) folgt erst mit T021/T022.
export async function getOrCreateEnrollment(userId: string, courseId: string) {
  const [existing] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
    .limit(1);
  if (existing) return existing;

  const [created] = await db.insert(enrollments).values({ userId, courseId }).returning();
  return created;
}

export async function getEnrollmentById(enrollmentId: string) {
  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.id, enrollmentId))
    .limit(1);
  return enrollment ?? null;
}

// Org-Scope wird über einen Join course -> program geprüft, da `enrollments` selbst
// keine `org_id`-Spalte hat (Konzept Abschnitt 4/5).
export async function enrollmentBelongsToOrg(enrollmentId: string, orgId: string) {
  const [row] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .innerJoin(programs, eq(courses.programId, programs.id))
    .where(and(eq(enrollments.id, enrollmentId), eq(programs.orgId, orgId)))
    .limit(1);
  return Boolean(row);
}

export async function getEnrollment(enrollmentId: string, orgId: string) {
  if (!(await enrollmentBelongsToOrg(enrollmentId, orgId))) return null;
  return getEnrollmentById(enrollmentId);
}

// Idempotent (T021-Abnahmekriterium): mehrfaches Einschreiben legt kein Duplikat an
// und liefert keinen Fehler. Eine zuvor ausgetragene (inactive/dropped) Einschreibung
// wird reaktiviert statt eine zweite Zeile anzulegen (UNIQUE(user_id, course_id)).
export async function enrollUser(userId: string, courseId: string, orgId: string) {
  if (!(await courseBelongsToOrg(courseId, orgId))) {
    return { error: 'course_not_found' as const };
  }

  const [existing] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
    .limit(1);

  if (existing) {
    if (existing.status === 'active') return { enrollment: existing };
    const [reactivated] = await db
      .update(enrollments)
      .set({ status: 'active', completedAt: null })
      .where(eq(enrollments.id, existing.id))
      .returning();
    return { enrollment: reactivated };
  }

  const [created] = await db.insert(enrollments).values({ userId, courseId }).returning();
  return { enrollment: created };
}

// Setzt Status auf `inactive` statt den Eintrag zu löschen — Verlauf (Fortschritt,
// Scores) bleibt erhalten (T021-Abnahmekriterium).
export async function unenrollUser(enrollmentId: string, orgId: string) {
  if (!(await enrollmentBelongsToOrg(enrollmentId, orgId))) return null;
  const [updated] = await db
    .update(enrollments)
    .set({ status: 'inactive' })
    .where(eq(enrollments.id, enrollmentId))
    .returning();
  return updated ?? null;
}

export interface CourseEnrollmentSummary {
  enrollmentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: (typeof enrollments.$inferSelect)['status'];
  startedAt: Date;
  completedAt: Date | null;
}

export async function listEnrollmentsForCourse(
  courseId: string,
  orgId: string,
): Promise<CourseEnrollmentSummary[] | null> {
  if (!(await courseBelongsToOrg(courseId, orgId))) return null;

  const rows = await db
    .select({
      enrollmentId: enrollments.id,
      userId: users.id,
      userName: users.name,
      userEmail: users.email,
      status: enrollments.status,
      startedAt: enrollments.startedAt,
      completedAt: enrollments.completedAt,
    })
    .from(enrollments)
    .innerJoin(users, eq(enrollments.userId, users.id))
    .where(eq(enrollments.courseId, courseId))
    .orderBy(users.name);

  return rows;
}

// Server Actions sind auch per direktem POST erreichbar (nicht nur über die UI) —
// verhindert, dass ein Nutzer über eine eigene Einschreibung Fortschritt für einen
// Block aus einem FREMDEN Kurs schreibt, indem er eine beliebige Block-ID mitschickt.
export async function blockBelongsToCourse(blockId: string, courseId: string) {
  const [block] = await db
    .select({ id: contentBlocks.id })
    .from(contentBlocks)
    .where(and(eq(contentBlocks.id, blockId), eq(contentBlocks.courseId, courseId)))
    .limit(1);
  return Boolean(block);
}

export async function listBlockProgressForEnrollment(enrollmentId: string) {
  const rows = await db
    .select()
    .from(blockProgress)
    .where(eq(blockProgress.enrollmentId, enrollmentId));
  return new Map(rows.map((row) => [row.blockId, row]));
}

export interface UpsertBlockProgressInput {
  status: BlockProgressStatus;
  score?: number;
  submissionData?: unknown;
}

export async function upsertBlockProgress(
  enrollmentId: string,
  blockId: string,
  input: UpsertBlockProgressInput,
) {
  const [existing] = await db
    .select()
    .from(blockProgress)
    .where(and(eq(blockProgress.enrollmentId, enrollmentId), eq(blockProgress.blockId, blockId)))
    .limit(1);

  const scoreValue = input.score !== undefined ? input.score.toString() : undefined;

  if (existing) {
    const [updated] = await db
      .update(blockProgress)
      .set({
        status: input.status,
        score: scoreValue,
        submissionData: input.submissionData,
        attempts: existing.attempts + 1,
      })
      .where(eq(blockProgress.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(blockProgress)
    .values({
      enrollmentId,
      blockId,
      status: input.status,
      score: scoreValue,
      submissionData: input.submissionData,
      attempts: 1,
    })
    .returning();
  return created;
}
