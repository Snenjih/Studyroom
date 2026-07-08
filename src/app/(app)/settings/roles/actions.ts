'use server';

import { revalidatePath } from 'next/cache';

import { getRole, setRolePermissions } from '@/lib/db/roles';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';

export type RolePermissionsFormState = { error?: string; success?: boolean } | undefined;

export async function updateRolePermissionsAction(
  roleId: string,
  _prevState: RolePermissionsFormState,
  formData: FormData,
): Promise<RolePermissionsFormState> {
  const session = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  const role = await getRole(roleId, session.orgId);
  if (!role) {
    return { error: 'Rolle nicht gefunden.' };
  }

  const permissionKeys = formData.getAll('permissions').map(String);
  await setRolePermissions(roleId, permissionKeys);

  revalidatePath(`/settings/roles/${roleId}`);
  return { success: true };
}
