import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { permissions, rolePermissions, roles, userRoles } from '@/db/schema';

import type { PermissionKey } from './permissions';
import { requireSession } from './session';

export class ForbiddenError extends Error {
  constructor(permission: string) {
    super(`Fehlende Permission: ${permission}`);
    this.name = 'ForbiddenError';
  }
}

// Ein JOIN statt user_roles -> roles -> role_permissions -> permissions einzeln
// abzufragen (kein N+1).
export async function getUserPermissions(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ key: permissions.key })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
    .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(eq(userRoles.userId, userId));

  return new Set(rows.map((row) => row.key));
}

export async function hasPermission(
  userId: string,
  permission: PermissionKey | string,
): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId);
  return userPermissions.has(permission);
}

// Für Route Handlers/Server Actions: liest die aktuelle Session, wirft ForbiddenError
// wenn die Permission fehlt (Aufrufer wandelt das in eine 403-Response um). Wirft/
// redirected bereits in requireSession(), wenn gar keine Session existiert.
export async function requirePermission(permission: PermissionKey | string) {
  const session = await requireSession();
  const allowed = await hasPermission(session.userId, permission);
  if (!allowed) {
    throw new ForbiddenError(permission);
  }
  return session;
}
