import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().trim().min(1, 'Titel ist erforderlich.'),
  description: z.string().trim().optional(),
  courseTypeId: z.string().uuid('Ungültige Course-Type-ID.'),
  config: z.record(z.string(), z.unknown()).optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createBlockSchema = z.object({
  blockType: z.string().trim().min(1, 'block_type ist erforderlich.'),
  content: z.record(z.string(), z.unknown()),
});

export const updateBlockSchema = z.object({
  content: z.record(z.string(), z.unknown()),
});

export const updateBlockPositionSchema = z.object({
  position: z.number().int().min(0),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateBlockInput = z.infer<typeof createBlockSchema>;
export type UpdateBlockInput = z.infer<typeof updateBlockSchema>;
export type UpdateBlockPositionInput = z.infer<typeof updateBlockPositionSchema>;
