import { z } from 'zod';

export const createProgramSchema = z.object({
  title: z.string().trim().min(1, 'Titel ist erforderlich.'),
  description: z.string().trim().optional(),
});

export const updateProgramSchema = createProgramSchema.partial();

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
