'use client';

import { useActionState } from 'react';

import type { RolePermissionsFormState } from '@/app/(app)/settings/roles/actions';

export interface PermissionOption {
  key: string;
  description: string | null;
  moduleKey: string | null;
}

interface RolePermissionsFormProps {
  action: (prevState: RolePermissionsFormState, formData: FormData) => Promise<RolePermissionsFormState>;
  permissions: PermissionOption[];
  assignedKeys: string[];
}

// Rendert die Permission-Liste rein aus den übergebenen Daten (aus der DB, T030) —
// kein hartcodiertes Permissions-Array in dieser Komponente.
export function RolePermissionsForm({ action, permissions, assignedKeys }: RolePermissionsFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const assigned = new Set(assignedKeys);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <ul className="flex flex-col gap-2">
        {permissions.map((permission) => (
          <li
            key={permission.key}
            className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2.5"
          >
            <input
              type="checkbox"
              id={`perm-${permission.key}`}
              name="permissions"
              value={permission.key}
              defaultChecked={assigned.has(permission.key)}
              className="accent-cyan-400"
            />
            <label htmlFor={`perm-${permission.key}`} className="flex flex-1 flex-col">
              <span className="font-mono text-sm text-zinc-100">{permission.key}</span>
              {permission.description && (
                <span className="text-xs text-zinc-500">{permission.description}</span>
              )}
            </label>
            {permission.moduleKey && (
              <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-400/80">
                {permission.moduleKey}
              </span>
            )}
          </li>
        ))}
      </ul>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && !pending && (
        <p className="font-mono text-[12px] text-cyan-400">✓ Gespeichert — sofort wirksam</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded bg-cyan-400 px-5 py-2 font-medium text-zinc-950 transition-colors hover:bg-cyan-300 disabled:opacity-50"
      >
        {pending ? 'Speichert…' : 'Permissions speichern'}
      </button>
    </form>
  );
}
