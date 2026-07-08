// Integrationstest gegen die lokale Dev-Postgres (siehe CLAUDE.md), analog zu den
// anderen `*.integration.test.ts`-Dateien. Regressionstest für einen Review-Fund nach
// T024-T032: `getUserPermissions()` muss Permissions eines inaktiven/unbekannten
// Moduls live ausfiltern, nicht nur über die (ggf. veraltete) `permissions.deprecated`-
// Spalte, die nur beim Aufruf von `syncPermissionsFromRegistry()` aktualisiert wird.
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

import { eq } from 'drizzle-orm';

import { closeDb, db } from '@/db';
import { organizations, permissions, rolePermissions, roles, userRoles, users } from '@/db/schema';

import { getUserPermissions } from './permission-check';

describe('getUserPermissions() filtert Permissions inaktiver Module live aus', () => {
  let userId: string;
  let roleId: string;
  const inactivePermissionKey = 'rbac-integration-test:inactive-perm';

  before(async () => {
    const [org] = await db.select().from(organizations).limit(1);
    if (!org) throw new Error('Keine Organisation gefunden — `npm run db:seed` ausführen.');

    const [user] = await db
      .insert(users)
      .values({
        orgId: org.id,
        email: 'rbac-integration-test@example.invalid',
        name: 'RBAC Test-User',
        passwordHash: 'not-a-real-hash',
      })
      .returning();
    userId = user.id;

    const [role] = await db
      .insert(roles)
      .values({ orgId: org.id, name: 'rbac-integration-test-role', description: null })
      .returning();
    roleId = role.id;

    const [corePermission] = await db
      .select({ id: permissions.id })
      .from(permissions)
      .where(eq(permissions.key, 'settings:manage'))
      .limit(1);
    if (!corePermission) throw new Error('Core-Permission settings:manage fehlt.');

    const [inactivePermission] = await db
      .insert(permissions)
      .values({
        key: inactivePermissionKey,
        description: null,
        moduleKey: 'a-module-that-is-not-in-available-modules',
        // Bewusst NICHT deprecated: der Test soll beweisen, dass die Filterung
        // NICHT von dieser (nur gelegentlich synchronisierten) Spalte abhängt.
        deprecated: false,
      })
      .returning();

    await db.insert(rolePermissions).values([
      { roleId, permissionId: corePermission.id },
      { roleId, permissionId: inactivePermission.id },
    ]);
    await db.insert(userRoles).values({ userId, roleId });
  });

  after(async () => {
    await db.delete(users).where(eq(users.id, userId));
    await db.delete(roles).where(eq(roles.id, roleId));
    await db.delete(permissions).where(eq(permissions.key, inactivePermissionKey));
    await closeDb();
  });

  test('Permission eines unbekannten/inaktiven Moduls wird ausgefiltert, Core-Permission bleibt erhalten', async () => {
    const result = await getUserPermissions(userId);
    assert.equal(result.has('settings:manage'), true);
    assert.equal(result.has(inactivePermissionKey), false);
  });
});
