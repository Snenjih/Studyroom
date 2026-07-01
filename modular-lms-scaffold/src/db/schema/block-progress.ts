import { relations } from 'drizzle-orm';
import { integer, jsonb, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { contentBlocks } from './content-blocks';
import { enrollments } from './enrollments';

// Kein DB-Enum — Status bleibt ein validierter String (Konzept Abschnitt 4 / T011).
export const BLOCK_PROGRESS_STATUSES = ['not_started', 'in_progress', 'done', 'failed'] as const;
export type BlockProgressStatus = (typeof BLOCK_PROGRESS_STATUSES)[number];

export const blockProgress = pgTable('block_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  enrollmentId: uuid('enrollment_id')
    .notNull()
    .references(() => enrollments.id, { onDelete: 'cascade' }),
  blockId: uuid('block_id')
    .notNull()
    .references(() => contentBlocks.id, { onDelete: 'cascade' }),
  status: text('status').$type<BlockProgressStatus>().notNull().default('not_started'),
  attempts: integer('attempts').notNull().default(0),
  score: numeric('score'),
  // Antworten, Code-Einreichung etc. — Struktur je Course-Type (Konzept Abschnitt 4).
  submissionData: jsonb('submission_data'),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const blockProgressRelations = relations(blockProgress, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [blockProgress.enrollmentId],
    references: [enrollments.id],
  }),
  block: one(contentBlocks, {
    fields: [blockProgress.blockId],
    references: [contentBlocks.id],
  }),
}));
