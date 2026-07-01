import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DeleteProgramButton } from '@/components/programs/DeleteProgramButton';
import { listPrograms } from '@/lib/db/programs';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

export default async function ProgramsPage() {
  const session = await requireSession();
  const canManage = await hasPermission(session.userId, PERMISSIONS.PROGRAMS_MANAGE);
  if (!canManage) notFound();

  const programList = await listPrograms(session.orgId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/80">
            Verwaltung
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-100">Programs</h1>
        </div>
        <Link
          href="/programs/new"
          className="rounded bg-cyan-400 px-4 py-2 font-medium text-zinc-950 transition-colors hover:bg-cyan-300"
        >
          + Neues Program
        </Link>
      </header>

      {programList.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-14 text-center">
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
          {programList.map((program) => (
            <li key={program.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-zinc-100">{program.title}</p>
                {program.description && (
                  <p className="mt-0.5 truncate text-sm text-zinc-500">{program.description}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/programs/${program.id}/courses`}
                  className="font-mono text-[12px] text-zinc-400 transition-colors hover:text-cyan-300"
                >
                  Courses
                </Link>
                <Link
                  href={`/programs/${program.id}/edit`}
                  className="font-mono text-[12px] text-cyan-400 transition-colors hover:text-cyan-300"
                >
                  Bearbeiten
                </Link>
                <DeleteProgramButton programId={program.id} programTitle={program.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
