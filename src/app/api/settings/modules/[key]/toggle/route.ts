import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { AVAILABLE_MODULES, isModuleEnabled } from '@/config/modules.config';
import { getRequestedDisabledModuleKeys, setModuleRequestedEnabled } from '@/lib/db/module-toggles';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';

interface RouteParams {
  params: Promise<{ key: string }>;
}

// Kippt den GEWÜNSCHTEN Aktivierungs-Zustand eines Moduls (persistiert in org_settings).
// Wirkt erst nach Übernahme in `ENABLED_MODULES` + App-Neustart (siehe modules.config.ts) —
// die Response macht das explizit, damit die UI es klar kommunizieren kann.
export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
    const { key } = await params;

    if (!AVAILABLE_MODULES.some((module) => module.key === key)) {
      return NextResponse.json({ error: 'Unbekanntes Modul' }, { status: 404 });
    }

    const requestedDisabled = await getRequestedDisabledModuleKeys(session.orgId);
    const currentlyRequestedEnabled = !requestedDisabled.includes(key);
    const nextEnabled = !currentlyRequestedEnabled;

    await setModuleRequestedEnabled(session.orgId, key, nextEnabled);

    return NextResponse.json({
      key,
      requestedEnabled: nextEnabled,
      activeNow: isModuleEnabled(key),
      restartRequired: nextEnabled !== isModuleEnabled(key),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
