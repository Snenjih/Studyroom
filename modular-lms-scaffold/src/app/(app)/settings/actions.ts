'use server';

import { revalidatePath } from 'next/cache';

import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { updateOrgSettingsSchema } from '@/lib/schemas/settings';
import { updateOrgSettings } from '@/lib/settings';
import { uploadOrgLogo } from '@/lib/storage';

export type SettingsFormState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined>; success?: boolean }
  | undefined;

export async function updateOrgSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  let logoKey: string | undefined;
  const logo = formData.get('logo');
  if (logo instanceof File && logo.size > 0) {
    logoKey = await uploadOrgLogo(session.orgId, logo);
  }

  const parsed = updateOrgSettingsSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    logoKey,
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await updateOrgSettings(session.orgId, parsed.data);
  revalidatePath('/settings');
  return { success: true };
}
