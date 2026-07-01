import { relations } from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { contentBlocks } from './content-blocks';
import { courseTypes } from './course-types';
import { programs } from './programs';

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id')
    .notNull()
    .references(() => programs.id, { onDelete: 'cascade' }),
  courseTypeId: uuid('course_type_id')
    .notNull()
    .references(() => courseTypes.id),
  title: text('title').notNull(),
  description: text('description'),
  // Typ-spezifische Einstellungen, z.B. Bestehensgrenze (Konzept Abschnitt 4).
  config: jsonb('config').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
  program: one(programs, {
    fields: [courses.programId],
    references: [programs.id],
  }),
  courseType: one(courseTypes, {
    fields: [courses.courseTypeId],
    references: [courseTypes.id],
  }),
  // Sortierung nach `position` erfolgt beim Query (Konzept Abschnitt 4), nicht hier.
  contentBlocks: many(contentBlocks),
}));
