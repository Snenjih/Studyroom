import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SettingsForm } from '@/components/settings/SettingsForm';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';
import { getOrgSettingsView } from '@/lib/settings';

import { updateOrgSettingsAction } from './actions';

export default async function SettingsPage() {
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.SETTINGS_MANAGE))) notFound();

  const settings = await getOrgSettingsView(session.orgId);

  return (
    <div className="mx-auto max-w-lg">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/80">Settings</p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-100">Organisation</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Grundeinstellungen deiner Organisation — sichtbar für alle Mitglieder.
      </p>
      <div className="mt-8">
        <SettingsForm action={updateOrgSettingsAction} defaultValues={settings} />
      </div>

      <div className="mt-12 border-t border-zinc-800/70 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Weitere Einstellungen
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          <li>
            <Link
              href="/settings/course-types"
              className="text-sm text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Course-Types →
            </Link>
          </li>
          <li>
            <Link
              href="/settings/roles"
              className="text-sm text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Rollen →
            </Link>
          </li>
          <li>
            <Link
              href="/settings/modules"
              className="text-sm text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Module →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
