'use server';

import { revalidatePath } from 'next/cache';

import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { updateOrgSettingsSchema } from '@/lib/schemas/settings';
import { setOrgLogo, updateOrgSettings } from '@/lib/settings';
import { uploadOrgLogo } from '@/lib/storage';

export type SettingsFormState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined>; success?: boolean }
  | undefined;

export async function updateOrgSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  const parsed = updateOrgSettingsSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') || undefined,
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await updateOrgSettings(session.orgId, parsed.data);

  // Logo-Key kommt ausschließlich aus einem echten Upload, nie aus dem geparsten
  // Formular-Input (siehe schemas/settings.ts) — separater Schritt mit eigener Fehler-
  // behandlung, damit ein Validierungsfehler beim Bild den Rest nicht blockiert.
  const logo = formData.get('logo');
  if (logo instanceof File && logo.size > 0) {
    try {
      const logoKey = await uploadOrgLogo(session.orgId, logo);
      await setOrgLogo(session.orgId, logoKey);
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Logo-Upload fehlgeschlagen.' };
    }
  }

  revalidatePath('/settings');
  return { success: true };
}
