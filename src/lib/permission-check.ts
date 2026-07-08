import 'server-only';

import { eq } from 'drizzle-orm';

import { getEnabledModules } from '@/config/modules.config';
import { db } from '@/db';
import { permissions, rolePermissions, roles, userRoles } from '@/db/schema';

import type { PermissionKey } from './permissions';

// Bewusst getrennt von `rbac.ts`: dieses Modul importiert `next/navigation`/
// `next/headers` nicht (über `./session`), lässt sich also außerhalb des Next.js-Builds
// (z.B. in node:test-Integrationstests) importieren, ohne dass `next/navigation`
// initialisiert werden muss. `rbac.ts` re-exportiert diese beiden Funktionen für
// bestehende Aufrufer, `requirePermission()` (session-abhängig) bleibt dort.

// Ein JOIN statt user_roles -> roles -> role_permissions -> permissions einzeln
// abzufragen (kein N+1).
//
// Filtert modul-eigene Permissions (T030) live gegen die aktuell aktiven Module
// (T031) aus, statt sich auf die `permissions.deprecated`-Spalte zu verlassen: die
// Spalte wird nur aktualisiert, wenn `syncPermissionsFromRegistry()` läuft (z.B. beim
// Aufruf der Rollen-Settings-Seite) und kann daher veraltet sein. `getEnabledModules()`
// ist rein synchron/env-basiert (kein zusätzlicher DB-Zugriff auf diesem Hot Path) und
// spiegelt immer den tatsächlich laufenden Registrierungs-Zustand wider — ein deaktiviertes
// Modul verliert seine Permissions dadurch sofort bei der Autorisierungsprüfung, nicht
// erst nachdem irgendwer die Rollen-Seite erneut aufgerufen hat. Core-Permissions
// (`moduleKey = NULL`) sind davon nie betroffen.
export async function getUserPermissions(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ key: permissions.key, moduleKey: permissions.moduleKey })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
    .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(eq(userRoles.userId, userId));

  const activeModuleKeys = new Set(getEnabledModules().map((module) => module.key));
  const activeKeys = rows
    .filter((row) => row.moduleKey === null || activeModuleKeys.has(row.moduleKey))
    .map((row) => row.key);

  return new Set(activeKeys);
}

export async function hasPermission(
  userId: string,
  permission: PermissionKey | string,
): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId);
  return userPermissions.has(permission);
}
