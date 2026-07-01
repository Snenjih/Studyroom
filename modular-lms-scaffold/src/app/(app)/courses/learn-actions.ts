'use server';

import { revalidatePath } from 'next/cache';

import type { BlockProgressStatus } from '@/db/schema';
import { blockBelongsToCourse, getEnrollmentById } from '@/lib/db/enrollments';
import { setBlockProgress } from '@/lib/db/progress';
import { requireSession } from '@/lib/session';

interface RecordBlockProgressInput {
  status: BlockProgressStatus;
  score?: number;
  submissionData?: unknown;
}

// Für Lernende, die ihren EIGENEN Fortschritt eintragen (Flip einer Flashcard,
// Quiz-Antwort) — kein `courses:manage` nötig, nur Eigentümerschaft der Einschreibung.
// Nutzt `setBlockProgress` (T022) statt des rohen `upsertBlockProgress`, damit der
// Completion-Check (`enrollments.completed_at`) auch über den echten Lern-Flow
// ausgelöst wird, nicht nur über die REST-API.
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
  // enrollment.courseId ist die vertrauenswürdige Quelle, nicht der übergebene
  // courseId-Parameter (Server Actions sind auch per direktem POST aufrufbar).
  if (!(await blockBelongsToCourse(blockId, enrollment.courseId))) {
    throw new Error('Block gehört nicht zu diesem Kurs.');
  }

  await setBlockProgress(enrollmentId, blockId, enrollment.courseId, input);
  revalidatePath(`/courses/${courseId}/learn`);
}
