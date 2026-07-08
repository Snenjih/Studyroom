import { and, eq, isNull } from 'drizzle-orm';

import { PERMISSIONS } from '@/lib/permissions';
import { hashPassword } from '@/lib/password';

import { db } from './index';
import {
  courseTypes,
  organizations,
  permissions,
  rolePermissions,
  roles,
  userRoles,
  users,
} from './schema';
import { BASE_ROLES } from './seed-data/base-roles';
import { BASE_COURSE_TYPES } from './seed-data/course-types';

// Idempotent: mehrfaches Ausführen legt keine Duplikate an (T008-Abnahmekriterium).
async function seed() {
  const orgName = process.env.ORG_NAME ?? 'Default Organization';
  const orgSlug = process.env.ORG_SLUG ?? 'default';

  const [org] = await db
    .insert(organizations)
    .values({ name: orgName, slug: orgSlug })
    .onConflictDoUpdate({
      target: organizations.slug,
      set: { name: orgName },
    })
    .returning();
  console.log(`Organisation: ${org.name} (${org.slug})`);

  const permissionIdByKey = new Map<string, string>();
  for (const key of Object.values(PERMISSIONS)) {
    const [permission] = await db
      .insert(permissions)
      .values({ key, moduleKey: null })
      .onConflictDoUpdate({
        target: permissions.key,
        set: { moduleKey: null },
      })
      .returning();
    permissionIdByKey.set(key, permission.id);
  }
  console.log(`Permissions: ${permissionIdByKey.size}`);

  const roleIdByName = new Map<string, string>();
  for (const roleDef of BASE_ROLES) {
    const [role] = await db
      .insert(roles)
      .values({ orgId: org.id, name: roleDef.name, description: roleDef.description })
      .onConflictDoUpdate({
        target: [roles.orgId, roles.name],
        set: { description: roleDef.description },
      })
      .returning();
    roleIdByName.set(roleDef.name, role.id);

    for (const permissionKey of roleDef.permissions) {
      const permissionId = permissionIdByKey.get(permissionKey);
      if (!permissionId) continue;
      await db
        .insert(rolePermissions)
        .values({ roleId: role.id, permissionId })
        .onConflictDoNothing();
    }
  }
  console.log(`Rollen: ${[...roleIdByName.keys()].join(', ')}`);

  for (const courseType of BASE_COURSE_TYPES) {
    await db
      .insert(courseTypes)
      .values({
        orgId: null,
        key: courseType.key,
        name: courseType.name,
        schemaDefinition: courseType.schemaDefinition,
        executionEngine: courseType.executionEngine,
      })
      .onConflictDoUpdate({
        target: courseTypes.key,
        set: {
          name: courseType.name,
          schemaDefinition: courseType.schemaDefinition,
          executionEngine: courseType.executionEngine,
        },
      });
  }
  console.log(`Course-Types: ${BASE_COURSE_TYPES.map((c) => c.key).join(', ')}`);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL und ADMIN_PASSWORD müssen gesetzt sein');
  }

  const [adminUser] = await db
    .insert(users)
    .values({
      orgId: org.id,
      email: adminEmail,
      name: 'Admin',
      passwordHash: await hashPassword(adminPassword),
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { name: 'Admin' },
    })
    .returning();

  const adminRoleId = roleIdByName.get('admin');
  if (!adminRoleId) throw new Error('admin-Rolle wurde nicht angelegt');

  const existingAssignment = await db
    .select()
    .from(userRoles)
    .where(
      and(
        eq(userRoles.userId, adminUser.id),
        eq(userRoles.roleId, adminRoleId),
        isNull(userRoles.scopeType),
        isNull(userRoles.scopeId),
      ),
    );
  if (existingAssignment.length === 0) {
    await db.insert(userRoles).values({ userId: adminUser.id, roleId: adminRoleId });
  }
  console.log(`Admin-User: ${adminUser.email}`);
}

seed()
  .then(() => {
    console.log('Seed abgeschlossen.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed fehlgeschlagen:', error);
    process.exit(1);
  });
