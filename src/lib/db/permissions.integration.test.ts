// Integrationstest gegen die lokale Dev-Postgres (siehe CLAUDE.md), analog zu den
// anderen `*.integration.test.ts`-Dateien. Beweist das zentrale T030-Abnahmekriterium:
// "Ein neues Modul mit permissions: ['new:perm'] taucht in der Rollen-UI auf" — hier
// direkt über die zugrundeliegende Registry + DB-Abgleich, nicht über die UI selbst.
import assert from 'node:assert/strict';
import { after, test } from 'node:test';

import { eq } from 'drizzle-orm';

import { closeDb, db } from '@/db';
import { permissions } from '@/db/schema';
import { moduleRegistry } from '@/lib/module-system';

import { listAssignablePermissions } from './permissions';

const TEST_PERMISSION_KEY = 't030-integration-test:new-perm';

after(async () => {
  await db.delete(permissions).where(eq(permissions.key, TEST_PERMISSION_KEY));
  await closeDb();
});

test('listAssignablePermissions() enthält Core-Permissions', async () => {
  const list = await listAssignablePermissions();
  const keys = list.map((permission) => permission.key);
  assert.ok(keys.includes('settings:manage'));
  assert.ok(keys.includes('courses:manage'));
});

test('ein neu registriertes Modul mit eigener Permission taucht dynamisch auf', async () => {
  // Simuliert genau das Beispiel aus dem Konzept (Abschnitt 8): ein Modul registriert
  // "code:execute" — hier mit einem eindeutigen Test-Key, damit nichts mit echten
  // Permissions kollidiert.
  moduleRegistry.register({
    key: 't030-integration-test-module',
    version: '1.0.0',
    register(config) {
      return {
        ...config,
        permissions: [
          ...config.permissions,
          {
            key: TEST_PERMISSION_KEY,
            description: 'Testperm für T030',
            moduleKey: 't030-integration-test-module',
          },
        ],
      };
    },
  });

  const list = await listAssignablePermissions();
  const found = list.find((permission) => permission.key === TEST_PERMISSION_KEY);
  assert.ok(found, 'Modul-Permission sollte in listAssignablePermissions() auftauchen');
  assert.equal(found?.moduleKey, 't030-integration-test-module');
  assert.equal(found?.deprecated, false);
});

test('eine nicht mehr registrierte Permission wird als deprecated markiert', async () => {
  // Legt eine "veraltete" Permission direkt in der DB an (simuliert eine Permission
  // aus einem inzwischen deaktivierten Modul) und prüft, dass der nächste Abgleich
  // sie als deprecated markiert und aus der Liste ausblendet.
  const staleKey = 't030-integration-test:stale-perm';
  await db
    .insert(permissions)
    .values({ key: staleKey, description: null, moduleKey: 'long-gone-module', deprecated: false })
    .onConflictDoNothing();

  const list = await listAssignablePermissions();
  assert.ok(!list.some((permission) => permission.key === staleKey));

  const [row] = await db.select().from(permissions).where(eq(permissions.key, staleKey)).limit(1);
  assert.equal(row?.deprecated, true);

  await db.delete(permissions).where(eq(permissions.key, staleKey));
});
