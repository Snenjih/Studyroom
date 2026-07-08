import 'server-only';

import { eq, notInArray } from 'drizzle-orm';

import { getConfig } from '@/app-config';
import { db } from '@/db';
import { permissions } from '@/db/schema';
import { PERMISSIONS } from '@/lib/permissions';

interface DesiredPermission {
  key: string;
  description: string | null;
  moduleKey: string | null;
}

// Soll-Zustand: Core-Permissions (module_key = NULL, siehe Konzept Abschnitt 8) +
// alle von aktiven Modulen über `AppConfig.permissions` registrierten Permissions.
function getDesiredPermissions(): DesiredPermission[] {
  const core: DesiredPermission[] = Object.values(PERMISSIONS).map((key) => ({
    key,
    description: null,
    moduleKey: null,
  }));
  const fromModules: DesiredPermission[] = getConfig().permissions.map((permission) => ({
    key: permission.key,
    description: permission.description ?? null,
    moduleKey: permission.moduleKey ?? null,
  }));
  return [...core, ...fromModules];
}

// Gleicht die `permissions`-Tabelle mit dem aktuellen Soll-Zustand ab (T030): neue
// Permissions werden eingetragen/reaktiviert, nicht mehr registrierte als `deprecated`
// markiert (Zeile bleibt wegen `role_permissions`-Fremdschlüssel erhalten). Läuft bei
// jedem Aufruf von `listAssignablePermissions()` statt einmalig beim Boot — Next.js hat
// im App-Router keinen zuverlässigen einzelnen Startpunkt über alle Deployment-Ziele
// hinweg, und der Abgleich ist günstig genug für einen Admin-Settings-Seitenaufruf.
export async function syncPermissionsFromRegistry(): Promise<void> {
  const desired = getDesiredPermissions();

  for (const permission of desired) {
    await db
      .insert(permissions)
      .values({ ...permission, deprecated: false })
      .onConflictDoUpdate({
        target: permissions.key,
        set: {
          description: permission.description,
          moduleKey: permission.moduleKey,
          deprecated: false,
        },
      });
  }

  const desiredKeys = desired.map((permission) => permission.key);
  if (desiredKeys.length > 0) {
    await db.update(permissions).set({ deprecated: true }).where(notInArray(permissions.key, desiredKeys));
  } else {
    await db.update(permissions).set({ deprecated: true });
  }
}

export async function listAssignablePermissions() {
  await syncPermissionsFromRegistry();
  return db
    .select()
    .from(permissions)
    .where(eq(permissions.deprecated, false))
    .orderBy(permissions.key);
}
