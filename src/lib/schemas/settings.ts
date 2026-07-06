import { z } from 'zod';

// `logoKey` ist bewusst NICHT Teil dieses Schemas: der Logo-Key darf ausschließlich
// aus einem echten, serverseitigen `uploadOrgLogo()`-Aufruf stammen (siehe
// `settings/actions.ts`), nie aus rohem Client-Input — sonst könnte ein Admin per
// PUT /api/settings eine beliebige Object-Key-String setzen und sich darüber eine
// presigned URL für ein FREMDES Objekt im (geteilten) MinIO-Bucket ausstellen lassen.
export const updateOrgSettingsSchema = z.object({
  name: z.string().trim().min(1, 'Name ist erforderlich.'),
  description: z.string().trim().optional(),
});

export type UpdateOrgSettingsInput = z.infer<typeof updateOrgSettingsSchema>;
