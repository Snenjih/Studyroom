import 'server-only';

import { and, asc, eq, max } from 'drizzle-orm';

import { db } from '@/db';
import { type BlockContent, contentBlocks, courses, courseTypes, programs } from '@/db/schema';
import { getSchemaDefinitionForVersion } from '@/lib/db/course-types';
import { validateBlock, type ValidationError } from '@/lib/schema-definition/validator';

import type {
  CreateBlockInput,
  CreateCourseInput,
  UpdateBlockInput,
  UpdateCourseInput,
} from '../schemas/course';

// Wird geworfen, wenn `content`/`block_type` nicht gegen die `schema_definition`
// des Course-Types besteht (Konzept Abschnitt 4). `toErrorResponse()` (api-error.ts)
// bildet das zentral auf eine 400-Response mit den einzelnen Feldfehlern ab.
export class BlockValidationError extends Error {
  constructor(public readonly errors: ValidationError[]) {
    super('Block-Validierung fehlgeschlagen');
    this.name = 'BlockValidationError';
  }
}

// Alle Courses-Queries prüfen den Org-Scope über einen Join auf `programs`,
// da `courses` selbst keine `org_id`-Spalte hat (gehört immer zu genau einem Program).

export async function listCoursesByProgram(programId: string, orgId: string) {
  const rows = await db
    .select({ course: courses })
    .from(courses)
    .innerJoin(programs, eq(courses.programId, programs.id))
    .where(and(eq(courses.programId, programId), eq(programs.orgId, orgId)))
    .orderBy(asc(courses.title));
  return rows.map((row) => row.course);
}

export async function getCourseWithBlocks(id: string, orgId: string) {
  const rows = await db
    .select({ course: courses, courseType: courseTypes })
    .from(courses)
    .innerJoin(programs, eq(courses.programId, programs.id))
    .innerJoin(courseTypes, eq(courses.courseTypeId, courseTypes.id))
    .where(and(eq(courses.id, id), eq(programs.orgId, orgId)))
    .limit(1);
  const row = rows[0];
  if (!row) return null;

  const blocks = await db
    .select()
    .from(contentBlocks)
    .where(eq(contentBlocks.courseId, id))
    .orderBy(asc(contentBlocks.position));

  return { ...row.course, courseType: row.courseType, blocks };
}

export async function listCourseTypes() {
  return db.select().from(courseTypes).orderBy(asc(courseTypes.name));
}

export async function courseTypeExists(courseTypeId: string) {
  const [courseType] = await db
    .select({ id: courseTypes.id })
    .from(courseTypes)
    .where(eq(courseTypes.id, courseTypeId))
    .limit(1);
  return Boolean(courseType);
}

async function programBelongsToOrg(programId: string, orgId: string) {
  const [program] = await db
    .select({ id: programs.id })
    .from(programs)
    .where(and(eq(programs.id, programId), eq(programs.orgId, orgId)))
    .limit(1);
  return Boolean(program);
}

export async function createCourse(
  programId: string,
  orgId: string,
  input: CreateCourseInput,
): Promise<
  { error: 'program_not_found' | 'course_type_not_found' } | { course: typeof courses.$inferSelect }
> {
  if (!(await programBelongsToOrg(programId, orgId))) {
    return { error: 'program_not_found' };
  }
  if (!(await courseTypeExists(input.courseTypeId))) {
    return { error: 'course_type_not_found' };
  }

  const [course] = await db
    .insert(courses)
    .values({
      programId,
      courseTypeId: input.courseTypeId,
      title: input.title,
      description: input.description,
      config: input.config ?? {},
    })
    .returning();
  return { course };
}

export async function courseBelongsToOrg(courseId: string, orgId: string) {
  const [row] = await db
    .select({ id: courses.id })
    .from(courses)
    .innerJoin(programs, eq(courses.programId, programs.id))
    .where(and(eq(courses.id, courseId), eq(programs.orgId, orgId)))
    .limit(1);
  return Boolean(row);
}

// Lädt den Course-Type (inkl. `schema_definition`) eines Kurses, org-gescoped —
// Grundlage für die Content-Block-Validierung (Konzept Abschnitt 4).
async function getCourseTypeForCourse(courseId: string, orgId: string) {
  const [row] = await db
    .select({ courseType: courseTypes })
    .from(courses)
    .innerJoin(programs, eq(courses.programId, programs.id))
    .innerJoin(courseTypes, eq(courses.courseTypeId, courseTypes.id))
    .where(and(eq(courses.id, courseId), eq(programs.orgId, orgId)))
    .limit(1);
  return row?.courseType ?? null;
}

export async function updateCourse(id: string, orgId: string, input: UpdateCourseInput) {
  if (!(await courseBelongsToOrg(id, orgId))) {
    return { error: 'course_not_found' as const };
  }
  if (input.courseTypeId && !(await courseTypeExists(input.courseTypeId))) {
    return { error: 'course_type_not_found' as const };
  }

  const [course] = await db.update(courses).set(input).where(eq(courses.id, id)).returning();
  return { course };
}

export async function deleteCourse(id: string, orgId: string) {
  if (!(await courseBelongsToOrg(id, orgId))) return null;
  const [course] = await db.delete(courses).where(eq(courses.id, id)).returning();
  return course ?? null;
}

export async function listBlocks(courseId: string, orgId: string) {
  if (!(await courseBelongsToOrg(courseId, orgId))) return null;
  return db
    .select()
    .from(contentBlocks)
    .where(eq(contentBlocks.courseId, courseId))
    .orderBy(asc(contentBlocks.position));
}

export async function createBlock(courseId: string, orgId: string, input: CreateBlockInput) {
  const courseType = await getCourseTypeForCourse(courseId, orgId);
  if (!courseType) return null;

  const validation = validateBlock(
    { blockType: input.blockType, content: input.content },
    courseType.schemaDefinition,
  );
  if (!validation.valid) throw new BlockValidationError(validation.errors);

  const [row] = await db
    .select({ maxPosition: max(contentBlocks.position) })
    .from(contentBlocks)
    .where(eq(contentBlocks.courseId, courseId));
  const nextPosition = (row?.maxPosition ?? -1) + 1;

  const [block] = await db
    .insert(contentBlocks)
    .values({
      courseId,
      position: nextPosition,
      blockType: input.blockType,
      content: input.content as unknown as BlockContent,
      // Neue Blöcke nutzen immer die aktuelle Course-Type-Version (T032-Abnahmekriterium).
      courseTypeVersion: courseType.version,
    })
    .returning();
  return block;
}

export async function updateBlock(
  courseId: string,
  blockId: string,
  orgId: string,
  input: UpdateBlockInput,
) {
  const courseType = await getCourseTypeForCourse(courseId, orgId);
  if (!courseType) return null;

  const [existing] = await db
    .select({ blockType: contentBlocks.blockType, courseTypeVersion: contentBlocks.courseTypeVersion })
    .from(contentBlocks)
    .where(and(eq(contentBlocks.id, blockId), eq(contentBlocks.courseId, courseId)))
    .limit(1);
  if (!existing) return null;

  // Validiert gegen die Schema-Version, mit der der Block zuletzt gespeichert wurde
  // (T032), nicht gegen die ggf. inzwischen neuere `courseType.schemaDefinition` —
  // sonst würde ein Schema-Update bestehende Blöcke rückwirkend invalidieren.
  const schemaDefinition =
    (await getSchemaDefinitionForVersion(courseType, existing.courseTypeVersion)) ??
    courseType.schemaDefinition;

  const validation = validateBlock(
    { blockType: existing.blockType, content: input.content },
    schemaDefinition,
  );
  if (!validation.valid) throw new BlockValidationError(validation.errors);

  const [block] = await db
    .update(contentBlocks)
    .set({ content: input.content as unknown as BlockContent })
    .where(and(eq(contentBlocks.id, blockId), eq(contentBlocks.courseId, courseId)))
    .returning();
  return block ?? null;
}

export async function updateBlockPosition(
  courseId: string,
  blockId: string,
  orgId: string,
  position: number,
) {
  if (!(await courseBelongsToOrg(courseId, orgId))) return null;
  const [block] = await db
    .update(contentBlocks)
    .set({ position })
    .where(and(eq(contentBlocks.id, blockId), eq(contentBlocks.courseId, courseId)))
    .returning();
  return block ?? null;
}

export async function deleteBlock(courseId: string, blockId: string, orgId: string) {
  if (!(await courseBelongsToOrg(courseId, orgId))) return null;
  const [block] = await db
    .delete(contentBlocks)
    .where(and(eq(contentBlocks.id, blockId), eq(contentBlocks.courseId, courseId)))
    .returning();
  return block ?? null;
}
