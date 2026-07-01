import 'server-only';

import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { orgSettings } from '@/db/schema';

import { getOrganization, updateOrganizationName } from './db/organizations';
import { getOrgLogoUrl } from './storage';
import type { UpdateOrgSettingsInput } from './schemas/settings';

export async function getSetting<T = unknown>(orgId: string, key: string): Promise<T | null> {
  const [row] = await db
    .select()
    .from(orgSettings)
    .where(and(eq(orgSettings.orgId, orgId), eq(orgSettings.key, key)))
    .limit(1);
  return row ? (row.value as T) : null;
}

export async function setSetting(orgId: string, key: string, value: unknown) {
  const [row] = await db
    .insert(orgSettings)
    .values({ orgId, key, value })
    .onConflictDoUpdate({
      target: [orgSettings.orgId, orgSettings.key],
      set: { value },
    })
    .returning();
  return row;
}

export interface OrgSettingsView {
  name: string;
  description: string;
  logoKey: string | null;
  logoUrl: string | null;
}

// Org-Name liegt relational in `organizations.name` (T004) — Beschreibung/Logo
// haben keine feste Spalte und leben im generischen `org_settings`-KV-Store (T023).
export async function getOrgSettingsView(orgId: string): Promise<OrgSettingsView> {
  const [org, description, logoKey] = await Promise.all([
    getOrganization(orgId),
    getSetting<string>(orgId, 'description'),
    getSetting<string>(orgId, 'logoKey'),
  ]);
  const logoUrl = logoKey ? await getOrgLogoUrl(logoKey) : null;

  return {
    name: org?.name ?? '',
    description: description ?? '',
    logoKey,
    logoUrl,
  };
}

export async function updateOrgSettings(
  orgId: string,
  input: UpdateOrgSettingsInput,
): Promise<void> {
  await updateOrganizationName(orgId, input.name);
  await setSetting(orgId, 'description', input.description ?? '');
  if (input.logoKey) {
    await setSetting(orgId, 'logoKey', input.logoKey);
  }
}
