'use server';

import { revalidatePath } from 'next/cache';

import type { BlockProgressStatus } from '@/db/schema';
import { getEnrollmentById, upsertBlockProgress } from '@/lib/db/enrollments';
import { requireSession } from '@/lib/session';

interface RecordBlockProgressInput {
  status: BlockProgressStatus;
  score?: number;
  submissionData?: unknown;
}

// Für Lernende, die ihren EIGENEN Fortschritt eintragen (Flip einer Flashcard,
// Quiz-Antwort) — kein `courses:manage` nötig, nur Eigentümerschaft der Einschreibung.
// Die vollständige Progress-Tracking-API folgt in T022, baut auf demselben DAL auf.
export async function recordBlockProgressAction(
  courseId: string,
  enrollmentId: string,
  blockId: string,
  input: RecordBlockProgressInput,
) {
  const session = await requireSession();
  const enrollment = await getEnrollmentById(enrollmentId);
  if (!enrollment || enrollment.userId !== session.userId) {
    throw new Error('Nicht berechtigt.');
  }

  await upsertBlockProgress(enrollmentId, blockId, input);
  revalidatePath(`/courses/${courseId}/learn`);
}
