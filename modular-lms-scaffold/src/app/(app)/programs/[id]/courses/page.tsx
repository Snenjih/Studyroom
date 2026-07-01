import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getProgram } from '@/lib/db/programs';
import { listCoursesByProgram } from '@/lib/db/courses';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgramCoursesPage({ params }: PageProps) {
  const { id: programId } = await params;
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.COURSES_MANAGE))) notFound();

  const program = await getProgram(programId, session.orgId);
  if (!program) notFound();

  const courseList = await listCoursesByProgram(programId, session.orgId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/80">
            {program.title}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-100">Courses</h1>
        </div>
        <Link
          href={`/programs/${programId}/courses/new`}
          className="rounded bg-cyan-400 px-4 py-2 font-medium text-zinc-950 transition-colors hover:bg-cyan-300"
        >
          + Neuer Kurs
        </Link>
      </header>

      {courseList.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-14 text-center">
          <p className="text-zinc-300">Noch keine Kurse in diesem Program</p>
          <Link
            href={`/programs/${programId}/courses/new`}
            className="mt-2 inline-block font-mono text-[12px] text-cyan-400 hover:text-cyan-300"
          >
            + Ersten Kurs anlegen
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900/40">
          {courseList.map((course) => (
            <li key={course.id}>
              <Link
                href={`/courses/${course.id}/edit`}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-900"
              >
                <div className="min-w-0">
                  <p className="truncate text-zinc-100">{course.title}</p>
                  {course.description && (
                    <p className="mt-0.5 truncate text-sm text-zinc-500">{course.description}</p>
                  )}
                </div>
                <span className="font-mono text-cyan-400/70">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link href="/programs" className="font-mono text-[12px] text-zinc-500 hover:text-zinc-300">
        ← Zurück zu Programs
      </Link>
    </div>
  );
}
