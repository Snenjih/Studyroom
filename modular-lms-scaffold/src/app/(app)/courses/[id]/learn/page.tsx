import Link from 'next/link';
import { notFound } from 'next/navigation';

import { recordBlockProgressAction } from '@/app/(app)/courses/learn-actions';
import { getCourseWithBlocks } from '@/lib/db/courses';
import { getOrCreateEnrollment, listBlockProgressForEnrollment } from '@/lib/db/enrollments';
import { setBlockProgress } from '@/lib/db/progress';
import { courseTypeRegistry } from '@/lib/course-type-registry';
import { requireSession } from '@/lib/session';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LearnCoursePage({ params }: PageProps) {
  const { id: courseId } = await params;
  const session = await requireSession();

  const course = await getCourseWithBlocks(courseId, session.orgId);
  if (!course) notFound();

  const enrollment = await getOrCreateEnrollment(session.userId, courseId);

  // Statische Course-Types (Markdown-Info) gelten als abgeschlossen, sobald sie
  // aufgerufen wurden — keine Nutzer-Interaktion nötig (Konzept Abschnitt 3/10, T018).
  if (course.courseType.executionEngine === 'static') {
    for (const block of course.blocks) {
      await setBlockProgress(enrollment.id, block.id, courseId, { status: 'done' });
    }
  }

  const progressByBlock = await listBlockProgressForEnrollment(enrollment.id);
  const registryEntry = courseTypeRegistry[course.courseType.key];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 py-2">
      <header>
        <Link
          href={`/programs/${course.programId}/courses`}
          className="font-mono text-[11px] text-zinc-500 transition-colors hover:text-zinc-300"
        >
          ← Zurück
        </Link>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/80">
          {course.courseType.name}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-100">{course.title}</h1>
        {course.description && <p className="mt-2 text-zinc-400">{course.description}</p>}
      </header>

      <div className="flex flex-col gap-10">
        {course.blocks.length === 0 && (
          <p className="text-zinc-500">Dieser Kurs hat noch keine Inhalte.</p>
        )}

        {course.blocks.map((block) => {
          const Renderer = registryEntry?.renderer;
          const progress = progressByBlock.get(block.id);
          const onComplete = recordBlockProgressAction.bind(
            null,
            courseId,
            enrollment.id,
            block.id,
          );

          return (
            <section
              key={block.id}
              className="border-t border-zinc-800/70 pt-8 first:border-t-0 first:pt-0"
            >
              {Renderer ? (
                <Renderer
                  content={block.content as unknown as Record<string, unknown>}
                  blockId={block.id}
                  enrollmentId={enrollment.id}
                  progress={
                    progress
                      ? {
                          status: progress.status,
                          score: progress.score,
                          submissionData: progress.submissionData,
                        }
                      : null
                  }
                  onComplete={onComplete}
                />
              ) : (
                <p className="text-sm text-zinc-600">Unbekannter Block-Typ: {block.blockType}</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
