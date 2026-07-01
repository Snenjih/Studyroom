import { relations } from 'drizzle-orm';
import { index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { blockProgress } from './block-progress';
import { courses } from './courses';

// Content-Struktur je `block_type`, wird beim Speichern gegen die
// `schema_definition` des jeweiligen Course-Types validiert (App-Schicht,
// Konzept Abschnitt 4 — nicht in der DB erzwungen).
export interface MarkdownBlockContent {
  content: string;
}

export interface FlashcardBlockContent {
  front: string;
  back: string;
}

export interface QuizQuestionBlockContent {
  question: string;
  options: string[];
  // snake_case, damit der JSON-Feldname exakt mit schema_definition (T012) und der
  // Auswertungslogik `submission_data.selected_index === correct_index` (T020) übereinstimmt.
  correct_index: number;
}

export type BlockContent = MarkdownBlockContent | FlashcardBlockContent | QuizQuestionBlockContent;

export const contentBlocks = pgTable(
  'content_blocks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    blockType: text('block_type').notNull(),
    content: jsonb('content').$type<BlockContent>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('content_blocks_content_gin_idx').using('gin', table.content)],
);

export const contentBlocksRelations = relations(contentBlocks, ({ one, many }) => ({
  course: one(courses, {
    fields: [contentBlocks.courseId],
    references: [courses.id],
  }),
  blockProgress: many(blockProgress),
}));
