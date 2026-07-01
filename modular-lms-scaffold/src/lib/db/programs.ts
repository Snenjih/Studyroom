import 'server-only';

import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { programs } from '@/db/schema';

import type { CreateProgramInput, UpdateProgramInput } from '../schemas/program';

export async function listPrograms(orgId: string) {
  return db.select().from(programs).where(eq(programs.orgId, orgId)).orderBy(programs.title);
}

export async function getProgram(id: string, orgId: string) {
  const [program] = await db
    .select()
    .from(programs)
    .where(and(eq(programs.id, id), eq(programs.orgId, orgId)))
    .limit(1);
  return program ?? null;
}

export async function createProgram(orgId: string, input: CreateProgramInput) {
  const [program] = await db
    .insert(programs)
    .values({ orgId, title: input.title, description: input.description })
    .returning();
  return program;
}

export async function updateProgram(id: string, orgId: string, input: UpdateProgramInput) {
  const [program] = await db
    .update(programs)
    .set(input)
    .where(and(eq(programs.id, id), eq(programs.orgId, orgId)))
    .returning();
  return program ?? null;
}

export async function deleteProgram(id: string, orgId: string) {
  const [program] = await db
    .delete(programs)
    .where(and(eq(programs.id, id), eq(programs.orgId, orgId)))
    .returning();
  return program ?? null;
}
