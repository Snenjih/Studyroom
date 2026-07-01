import 'server-only';

import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { blockProgress, type BlockProgressStatus, contentBlocks, enrollments } from '@/db/schema';

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

interface UpsertBlockProgressInput {
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
