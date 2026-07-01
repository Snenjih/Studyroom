import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { courses } from './courses';
import { organizations } from './organizations';

// org_id = NULL bedeutet System-Default-Typ, org-weit verfügbar (Konzept Abschnitt 4).
export const courseTypes = pgTable('course_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  schemaDefinition: jsonb('schema_definition').notNull(),
  executionEngine: text('execution_engine').notNull(),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const courseTypesRelations = relations(courseTypes, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [courseTypes.orgId],
    references: [organizations.id],
  }),
  courses: many(courses),
}));
