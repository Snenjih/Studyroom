'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  createBlock,
  createCourse,
  deleteBlock,
  deleteCourse,
  listBlocks,
  updateBlock,
  updateBlockPosition,
  updateCourse,
} from '@/lib/db/courses';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { createBlockSchema, createCourseSchema, updateCourseSchema } from '@/lib/schemas/course';

export type CourseFormState =
  { error?: string; fieldErrors?: Record<string, string[] | undefined> } | undefined;

export async function createCourseAction(
  programId: string,
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);

  const parsed = createCourseSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    courseTypeId: formData.get('courseTypeId'),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await createCourse(programId, session.orgId, parsed.data);
  if ('error' in result) {
    return {
      error:
        result.error === 'course_type_not_found'
          ? 'Ungültiger Course-Type.'
          : 'Program nicht gefunden.',
    };
  }

  revalidatePath(`/programs/${programId}/courses`);
  redirect(`/courses/${result.course.id}/edit`);
}

export async function updateCourseAction(
  courseId: string,
  programId: string,
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);

  const parsed = updateCourseSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await updateCourse(courseId, session.orgId, parsed.data);
  if ('error' in result) {
    return { error: 'Kurs nicht gefunden.' };
  }

  revalidatePath(`/courses/${courseId}/edit`);
  revalidatePath(`/programs/${programId}/courses`);
  return undefined;
}

export async function deleteCourseAction(courseId: string, programId: string) {
  const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
  await deleteCourse(courseId, session.orgId);
  revalidatePath(`/programs/${programId}/courses`);
  redirect(`/programs/${programId}/courses`);
}

export async function addBlockAction(
  courseId: string,
  blockType: string,
  content: Record<string, unknown>,
) {
  const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
  const parsed = createBlockSchema.parse({ blockType, content });
  await createBlock(courseId, session.orgId, parsed);
  revalidatePath(`/courses/${courseId}/edit`);
}

export async function updateBlockContentAction(
  courseId: string,
  blockId: string,
  content: Record<string, unknown>,
) {
  const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
  await updateBlock(courseId, blockId, session.orgId, { content });
  revalidatePath(`/courses/${courseId}/edit`);
}

export async function moveBlockAction(courseId: string, blockId: string, direction: 'up' | 'down') {
  const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
  const blocks = await listBlocks(courseId, session.orgId);
  if (!blocks) return;

  const index = blocks.findIndex((block) => block.id === blockId);
  if (index === -1) return;

  const neighborIndex = direction === 'up' ? index - 1 : index + 1;
  if (neighborIndex < 0 || neighborIndex >= blocks.length) return;

  const current = blocks[index];
  const neighbor = blocks[neighborIndex];
  await updateBlockPosition(courseId, current.id, session.orgId, neighbor.position);
  await updateBlockPosition(courseId, neighbor.id, session.orgId, current.position);
  revalidatePath(`/courses/${courseId}/edit`);
}

export async function deleteBlockAction(courseId: string, blockId: string) {
  const session = await requirePermission(PERMISSIONS.COURSES_MANAGE);
  await deleteBlock(courseId, blockId, session.orgId);
  revalidatePath(`/courses/${courseId}/edit`);
}
