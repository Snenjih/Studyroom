import Link from 'next/link';

import { CourseCard } from '@/components/dashboard/CourseCard';
import { getEnrolledCourses, getManagedPrograms } from '@/lib/db/dashboard';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

export default async function DashboardPage() {
  const session = await requireSession();
  const [enrolledCourses, canManagePrograms] = await Promise.all([
    getEnrolledCourses(session.userId),
    hasPermission(session.userId, PERMISSIONS.PROGRAMS_MANAGE),
  ]);
  const managedPrograms = canManagePrograms ? await getManagedPrograms(session.orgId) : [];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/80">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-100">Willkommen zurück</h1>
      </header>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-mono text-sm uppercase tracking-wider text-zinc-400">
            Meine Kurse
          </h2>
          <span className="font-mono text-[11px] text-zinc-600">{enrolledCourses.length} eingeschrieben</span>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-14 text-center">
            <p className="text-zinc-300">Noch keine Kurse — jetzt einschreiben</p>
            <p className="mt-1 font-mono text-[12px] text-zinc-600">
              Sobald du in einen Kurs eingeschrieben bist, erscheint er hier mit deinem Fortschritt.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((enrollment) => (
              <CourseCard
                key={enrollment.enrollmentId}
                courseId={enrollment.courseId}
                title={enrollment.courseTitle}
                programTitle={enrollment.programTitle}
                progressPercent={enrollment.progressPercent}
              />
            ))}
          </div>
        )}
      </section>

      {canManagePrograms && (
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-mono text-sm uppercase tracking-wider text-zinc-400">
              Verwaltete Programme
            </h2>
            <Link
              href="/programs"
              className="font-mono text-[11px] text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Alle anzeigen →
            </Link>
          </div>

          {managedPrograms.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-10 text-center">
              <p className="text-zinc-300">Noch keine Programme angelegt</p>
              <Link
                href="/programs/new"
                className="mt-2 inline-block font-mono text-[12px] text-cyan-400 hover:text-cyan-300"
              >
                + Erstes Program anlegen
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900/40">
              {managedPrograms.map((program) => (
                <li key={program.id}>
                  <Link
                    href={`/programs/${program.id}/edit`}
                    className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-zinc-900"
                  >
                    <span className="text-zinc-200">{program.title}</span>
                    <span className="font-mono text-cyan-400/70">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
