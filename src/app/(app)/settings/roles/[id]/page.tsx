import Link from 'next/link';
import { notFound } from 'next/navigation';

import { RolePermissionsForm } from '@/components/settings/RolePermissionsForm';
import { listAssignablePermissions } from '@/lib/db/permissions';
import { getRole, getRolePermissionKeys } from '@/lib/db/roles';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

import { updateRolePermissionsAction } from '../actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RolePage({ params }: PageProps) {
  const { id: roleId } = await params;
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.SETTINGS_MANAGE))) notFound();

  const role = await getRole(roleId, session.orgId);
  if (!role) notFound();

  const [permissionsList, assignedKeys] = await Promise.all([
    listAssignablePermissions(),
    getRolePermissionKeys(roleId),
  ]);

  const boundAction = updateRolePermissionsAction.bind(null, roleId);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/settings/roles"
        className="font-mono text-[11px] text-zinc-500 hover:text-zinc-300"
      >
        ← Rollen
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-100">{role.name}</h1>
      {role.description && <p className="mt-2 text-sm text-zinc-500">{role.description}</p>}

      <div className="mt-8">
        <RolePermissionsForm
          action={boundAction}
          permissions={permissionsList}
          assignedKeys={[...assignedKeys]}
        />
      </div>
    </div>
  );
}
