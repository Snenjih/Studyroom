import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import type { SchemaDefinition } from '@/lib/schema-definition/types';

import { courses } from './courses';
import { organizations } from './organizations';

// Beschreibt, welche Block-Typen ein Course-Type erlaubt und welche Felder sie haben
// (Konzept Abschnitt 4). Wird beim Speichern gegen `content_blocks.content` geprüft
// (App-Schicht). Formales Format seit T026 in `lib/schema-definition/types.ts` — dieser
// Alias bleibt der DB-seitige Name, damit bestehende Importe (`db/schema`) stabil bleiben.
export type CourseTypeSchemaDefinition = SchemaDefinition;

// org_id = NULL bedeutet System-Default-Typ, org-weit verfügbar (Konzept Abschnitt 4).
export const courseTypes = pgTable('course_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  schemaDefinition: jsonb('schema_definition').$type<CourseTypeSchemaDefinition>().notNull(),
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
