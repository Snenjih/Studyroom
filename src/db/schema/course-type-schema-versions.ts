import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

import { courseTypes, type CourseTypeSchemaDefinition } from './course-types';

// Archiv historischer `schema_definition`-Stände eines Course-Types (Konzept
// Abschnitt 9, T032): bei jedem Schema-Update wird der VORHERIGE Stand hierher
// archiviert, bevor `course_types.schema_definition`/`version` überschrieben werden —
// bestehende `content_blocks` validieren weiter gegen die Version, mit der sie
// angelegt wurden (`content_blocks.course_type_version`), nicht gegen die aktuelle.
export const courseTypeSchemaVersions = pgTable(
  'course_type_schema_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseTypeId: uuid('course_type_id')
      .notNull()
      .references(() => courseTypes.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    schemaDefinition: jsonb('schema_definition').$type<CourseTypeSchemaDefinition>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.courseTypeId, table.version)],
);

export const courseTypeSchemaVersionsRelations = relations(courseTypeSchemaVersions, ({ one }) => ({
  courseType: one(courseTypes, {
    fields: [courseTypeSchemaVersions.courseTypeId],
    references: [courseTypes.id],
  }),
}));
