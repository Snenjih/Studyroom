import 'server-only';

import { hasPermission } from './permission-check';
import type { PermissionKey } from './permissions';
import { requireSession } from './session';

export { getUserPermissions, hasPermission } from './permission-check';

export class ForbiddenError extends Error {
  constructor(permission: string) {
    super(`Fehlende Permission: ${permission}`);
    this.name = 'ForbiddenError';
  }
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
