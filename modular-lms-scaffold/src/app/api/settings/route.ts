import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { updateOrgSettingsSchema } from '@/lib/schemas/settings';
import { getOrgSettingsView, updateOrgSettings } from '@/lib/settings';

export async function GET() {
  try {
    const session = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
    const settings = await getOrgSettingsView(session.orgId);
    return NextResponse.json(settings);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
    const body = await request.json();
    const input = updateOrgSettingsSchema.parse(body);
    await updateOrgSettings(session.orgId, input);
    const settings = await getOrgSettingsView(session.orgId);
    return NextResponse.json(settings);
  } catch (error) {
    return toErrorResponse(error);
  }
}
