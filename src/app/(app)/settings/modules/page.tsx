import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ModuleToggleButton } from '@/components/settings/ModuleToggleButton';
import { AVAILABLE_MODULES, isModuleEnabled } from '@/config/modules.config';
import { getRequestedDisabledModuleKeys } from '@/lib/db/module-toggles';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

export default async function ModulesPage() {
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.SETTINGS_MANAGE))) notFound();

  const requestedDisabled = await getRequestedDisabledModuleKeys(session.orgId);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/settings" className="font-mono text-[11px] text-zinc-500 hover:text-zinc-300">
        ← Settings
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-100">Module</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Nur aktive Module registrieren ihren Course-Type und ihre Permissions (Konzept
        Abschnitt 2). Änderungen hier wirken erst, nachdem die Umgebungsvariable{' '}
        <code className="rounded bg-zinc-900 px-1 py-0.5 font-mono text-xs text-cyan-300">
          ENABLED_MODULES
        </code>{' '}
        entsprechend angepasst und die App neu gestartet wurde.
      </p>

      <ul className="mt-8 flex flex-col gap-3">
        {AVAILABLE_MODULES.map((module) => {
          const activeNow = isModuleEnabled(module.key);
          const requestedEnabled = !requestedDisabled.includes(module.key);
          const pendingRestart = requestedEnabled !== activeNow;

          return (
            <li
              key={module.key}
              className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
            >
              <div>
                <p className="text-zinc-100">{module.name ?? module.key}</p>
                {module.description && (
                  <p className="mt-0.5 text-sm text-zinc-500">{module.description}</p>
                )}
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider">
                  <span className={activeNow ? 'text-cyan-400' : 'text-zinc-600'}>
                    {activeNow ? 'Aktiv' : 'Inaktiv'}
                  </span>
                  {pendingRestart && (
                    <span className="ml-2 text-amber-400">
                      — {requestedEnabled ? 'Aktivierung' : 'Deaktivierung'} nach Neustart wirksam
                    </span>
                  )}
                </p>
              </div>
              <ModuleToggleButton moduleKey={module.key} requestedEnabled={requestedEnabled} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
