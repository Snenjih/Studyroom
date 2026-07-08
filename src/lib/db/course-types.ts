import 'server-only';

import { and, asc, eq, isNull, or } from 'drizzle-orm';

import { db } from '@/db';
import { courseTypes } from '@/db/schema';
import type { SchemaDefinition } from '@/lib/schema-definition/types';

export interface CreateCourseTypeInput {
  key: string;
  name: string;
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
