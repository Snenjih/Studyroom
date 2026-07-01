import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

import { blockProgress } from './block-progress';
import { courses } from './courses';
import { users } from './users';

// Kein DB-Enum (Konzept Abschnitt 4/T011) — Status bleibt ein validierter String,
// damit neue Status-Werte ohne Migration ergänzt werden können.
export const ENROLLMENT_STATUSES = ['active', 'completed', 'dropped', 'inactive'] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

export const enrollments = pgTable(
  'enrollments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    status: text('status').$type<EnrollmentStatus>().notNull().default('active'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => [unique().on(table.userId, table.courseId)],
);

export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  blockProgress: many(blockProgress),
}));
