'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createProgram, deleteProgram, updateProgram } from '@/lib/db/programs';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { createProgramSchema, updateProgramSchema } from '@/lib/schemas/program';

export type ProgramFormState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined> }
  | undefined;

export async function createProgramAction(
  _prevState: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  const session = await requirePermission(PERMISSIONS.PROGRAMS_MANAGE);

  const parsed = createProgramSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const program = await createProgram(session.orgId, parsed.data);
  revalidatePath('/programs');
  redirect(`/programs/${program.id}/edit`);
}

export async function updateProgramAction(
  id: string,
  _prevState: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  const session = await requirePermission(PERMISSIONS.PROGRAMS_MANAGE);

  const parsed = updateProgramSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const program = await updateProgram(id, session.orgId, parsed.data);
  if (!program) {
    return { error: 'Program nicht gefunden.' };
  }

  revalidatePath('/programs');
  redirect('/programs');
}

export async function deleteProgramAction(id: string) {
  const session = await requirePermission(PERMISSIONS.PROGRAMS_MANAGE);
  await deleteProgram(id, session.orgId);
  revalidatePath('/programs');
}
