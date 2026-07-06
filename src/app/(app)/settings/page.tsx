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
    </div>
  );
}
