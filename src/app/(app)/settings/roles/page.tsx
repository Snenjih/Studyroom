import Link from 'next/link';
import { notFound } from 'next/navigation';

import { listRoles } from '@/lib/db/roles';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

export default async function RolesPage() {
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.SETTINGS_MANAGE))) notFound();

  const rolesList = await listRoles(session.orgId);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/settings" className="font-mono text-[11px] text-zinc-500 hover:text-zinc-300">
        ← Settings
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-100">Rollen</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Permissions werden dynamisch aus Core + allen aktiven Modulen zusammengestellt
        (Konzept Abschnitt 8) — nicht aus einer fest verdrahteten Liste.
      </p>

      <ul className="mt-8 flex flex-col gap-3">
        {rolesList.map((role) => (
          <li key={role.id}>
            <Link
              href={`/settings/roles/${role.id}`}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 transition-colors hover:border-cyan-500/40"
            >
              <div>
                <p className="text-zinc-100">{role.name}</p>
                {role.description && <p className="mt-0.5 text-sm text-zinc-500">{role.description}</p>}
              </div>
              <span className="font-mono text-[11px] text-zinc-600">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
