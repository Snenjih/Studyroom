import 'server-only';

import { and, eq, inArray } from 'drizzle-orm';

import { db } from '@/db';
import { permissions, rolePermissions, roles } from '@/db/schema';

export async function listRoles(orgId: string) {
  return db.select().from(roles).where(eq(roles.orgId, orgId)).orderBy(roles.name);
}

export async function getRole(id: string, orgId: string) {
  const [role] = await db
    .select()
    .from(roles)
    .where(and(eq(roles.id, id), eq(roles.orgId, orgId)))
    .limit(1);
  return role ?? null;
}

export async function getRolePermissionKeys(roleId: string): Promise<Set<string>> {
  const rows = await db
    .select({ key: permissions.key })
    .from(rolePermissions)
    .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(eq(rolePermissions.roleId, roleId));
  return new Set(rows.map((row) => row.key));
}

// Ersetzt die komplette Permission-Zuweisung einer Rolle durch `permissionKeys`
// (Konzept Abschnitt 8: Rollen-UI konfiguriert beliebige, auch modul-eigene
// Permissions). Unbekannte Keys werden stillschweigend ignoriert (z.B. wenn ein
// Formular-Request eine mittlerweile deprecated/entfernte Permission enthält).
export async function setRolePermissions(roleId: string, permissionKeys: string[]): Promise<void> {
  const matchingPermissions = permissionKeys.length
    ? await db
        .select({ id: permissions.id })
        .from(permissions)
        .where(inArray(permissions.key, permissionKeys))
    : [];

  await db.transaction(async (tx) => {
    await tx.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
    if (matchingPermissions.length > 0) {
      await tx
        .insert(rolePermissions)
        .values(matchingPermissions.map((permission) => ({ roleId, permissionId: permission.id })));
    }
  });
}
