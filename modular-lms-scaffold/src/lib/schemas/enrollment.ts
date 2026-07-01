import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  courseId: z.string().uuid('Ungültige Course-ID.'),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
