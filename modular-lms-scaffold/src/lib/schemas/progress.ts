import { z } from 'zod';

import { BLOCK_PROGRESS_STATUSES } from '@/db/schema';

export const setBlockProgressSchema = z.object({
  status: z.enum(BLOCK_PROGRESS_STATUSES),
  score: z.number().optional(),
  submissionData: z.unknown().optional(),
});

export type SetBlockProgressInput = z.infer<typeof setBlockProgressSchema>;
