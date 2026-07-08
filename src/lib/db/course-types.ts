import 'server-only';

import { and, asc, count, eq, isNull, ne, or } from 'drizzle-orm';

import { db } from '@/db';
import { contentBlocks, courses, courseTypeSchemaVersions, courseTypes } from '@/db/schema';
import type { SchemaDefinition } from '@/lib/schema-definition/types';

export interface CreateCourseTypeInput {
  key: string;
  name: string;
  schemaDefinition: SchemaDefinition;
}

export interface UpdateCourseTypeSchemaInput {
  name?: string;
  schemaDefinition: SchemaDefinition;
}

// System-Typen haben `org_id = NULL` (Konzept Abschnitt 4) — org-weit sichtbar, aber
// nicht durch den Type-Editor bearbeitbar (T028-Abnahmekriterium).
export function isSystemCourseType(courseType: { orgId: string | null }): boolean {
  return courseType.orgId === null;
}

// System-Typen + die eigenen Custom-Typen der Org, alphabetisch.
export async function listCourseTypesForOrg(orgId: string) {
  return db
    .select()
    .from(courseTypes)
    .where(or(isNull(courseTypes.orgId), eq(courseTypes.orgId, orgId)))
    .orderBy(asc(courseTypes.name));
}

export async function getCourseTypeForOrg(id: string, orgId: string) {
  const [courseType] = await db
    .select()
    .from(courseTypes)
    .where(and(eq(courseTypes.id, id), or(isNull(courseTypes.orgId), eq(courseTypes.orgId, orgId))))
    .limit(1);
  return courseType ?? null;
}

export async function courseTypeKeyExists(key: string): Promise<boolean> {
  const [row] = await db
    .select({ id: courseTypes.id })
    .from(courseTypes)
    .where(eq(courseTypes.key, key))
    .limit(1);
  return Boolean(row);
}

// Custom-Typen laufen immer über die generische Execution-Engine (T029) — die
// "Custom-Engine-Modul"-Stufe aus Konzept Abschnitt 3 ist Entwickler-Code (eigenes
// AppModule), kein Ergebnis des Schema-Editors.
const GENERIC_EXECUTION_ENGINE = 'generic';

export async function createCourseType(
  orgId: string,
  input: CreateCourseTypeInput,
): Promise<{ error: 'key_exists' } | { courseType: typeof courseTypes.$inferSelect }> {
  if (await courseTypeKeyExists(input.key)) {
    return { error: 'key_exists' };
  }

  const [courseType] = await db
    .insert(courseTypes)
    .values({
      orgId,
      key: input.key,
      name: input.name,
      schemaDefinition: input.schemaDefinition,
      executionEngine: GENERIC_EXECUTION_ENGINE,
    })
    .returning();
  return { courseType };
}

// Löst die schema_definition auf, die für einen bestimmten
// `content_blocks.course_type_version` gültig war (Konzept Abschnitt 9, T032):
// entspricht der aktuellen, wenn die Version übereinstimmt, sonst wird das Archiv
// (`course_type_schema_versions`) befragt.
export async function getSchemaDefinitionForVersion(
  courseType: { id: string; version: number; schemaDefinition: SchemaDefinition },
  version: number,
): Promise<SchemaDefinition | null> {
  if (version === courseType.version) return courseType.schemaDefinition;

  const [historic] = await db
    .select({ schemaDefinition: courseTypeSchemaVersions.schemaDefinition })
    .from(courseTypeSchemaVersions)
    .where(
      and(
        eq(courseTypeSchemaVersions.courseTypeId, courseType.id),
        eq(courseTypeSchemaVersions.version, version),
      ),
    )
    .limit(1);
  return historic?.schemaDefinition ?? null;
}

// Ersetzt die schema_definition eines EIGENEN Course-Types — archiviert den bisherigen
// Stand statt ihn zu überschreiben und erhöht `version`. System-Typen (org_id = NULL)
// können hierüber nie getroffen werden, da `eq(courseTypes.orgId, orgId)` gegen NULL
// nie matcht (T028-Abnahmekriterium: System-Typen bleiben schreibgeschützt). Bestehende
// Blöcke referenzieren weiter ihre alte `course_type_version` und validieren dagegen —
// kein Auto-Migrate (T032-Abnahmekriterium).
export async function updateCourseTypeSchema(
  id: string,
  orgId: string,
  input: UpdateCourseTypeSchemaInput,
): Promise<{ error: 'not_found' } | { courseType: typeof courseTypes.$inferSelect }> {
  const [existing] = await db
    .select()
    .from(courseTypes)
    .where(and(eq(courseTypes.id, id), eq(courseTypes.orgId, orgId)))
    .limit(1);
  if (!existing) return { error: 'not_found' };

  const [courseType] = await db.transaction(async (tx) => {
    await tx.insert(courseTypeSchemaVersions).values({
      courseTypeId: existing.id,
      version: existing.version,
      schemaDefinition: existing.schemaDefinition,
    });

    return tx
      .update(courseTypes)
      .set({
        name: input.name ?? existing.name,
        schemaDefinition: input.schemaDefinition,
        version: existing.version + 1,
      })
      .where(eq(courseTypes.id, id))
      .returning();
  });

  return { courseType };
}

// Zählt Blöcke, die noch gegen eine ÄLTERE (oder neuere, sollte praktisch nicht
// vorkommen) Version dieses Course-Types validieren — Grundlage für die Admin-Warnung
// "X bestehende Blöcke nutzen alte Version" im Type-Editor.
export async function countBlocksOnOutdatedVersion(
  courseTypeId: string,
  currentVersion: number,
): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(contentBlocks)
    .innerJoin(courses, eq(contentBlocks.courseId, courses.id))
    .where(
      and(eq(courses.courseTypeId, courseTypeId), ne(contentBlocks.courseTypeVersion, currentVersion)),
    );
  return row?.total ?? 0;
}
