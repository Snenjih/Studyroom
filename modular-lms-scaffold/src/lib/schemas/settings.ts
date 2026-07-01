import { z } from 'zod';

export const updateOrgSettingsSchema = z.object({
  name: z.string().trim().min(1, 'Name ist erforderlich.'),
  description: z.string().trim().optional(),
  logoKey: z.string().trim().optional(),
});

export type UpdateOrgSettingsInput = z.infer<typeof updateOrgSettingsSchema>;
