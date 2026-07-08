import Link from 'next/link';
import { notFound } from 'next/navigation';

import { isSystemCourseType, listCourseTypesForOrg } from '@/lib/db/course-types';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

export default async function CourseTypesPage() {
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.SETTINGS_MANAGE))) notFound();

  const courseTypesList = await listCourseTypesForOrg(session.orgId);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/settings"
        className="font-mono text-[11px] text-zinc-500 hover:text-zinc-300"
      >
        ← Settings
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-100">Course-Types</h1>
        <Link
          href="/settings/course-types/new"
          className="rounded bg-cyan-400 px-3 py-1.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-cyan-300"
        >
          + Neuer Course-Type
        </Link>
      </div>
      <p className="mt-2 text-sm text-zinc-500">
        System-Typen sind schreibgeschützt. Eigene Course-Types entstehen ohne Code über den
        Felder-Builder (Konzept Abschnitt 3).
      </p>

      <ul className="mt-8 flex flex-col gap-3">
        {courseTypesList.map((courseType) => (
          <li
            key={courseType.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
          >
            <div>
              <p className="text-zinc-100">{courseType.name}</p>
              <p className="font-mono text-[11px] text-zinc-500">{courseType.key}</p>
            </div>
            {isSystemCourseType(courseType) ? (
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
                System · schreibgeschützt
              </span>
            ) : (
              <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-400/80">
                Custom
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
