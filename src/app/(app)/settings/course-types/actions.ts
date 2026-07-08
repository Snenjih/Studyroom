'use server';

import { redirect } from 'next/navigation';

import { createCourseType, updateCourseTypeSchema } from '@/lib/db/course-types';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import {
  createCourseTypeSchema,
  toFieldDefinition,
  updateCourseTypeFieldsSchema,
} from '@/lib/schemas/course-type';

export type CourseTypeFormState = { error?: string } | undefined;

export async function createCourseTypeAction(
  _prevState: CourseTypeFormState,
  formData: FormData,
): Promise<CourseTypeFormState> {
  const session = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  let parsedFields: unknown;
  try {
    const raw = formData.get('fieldsJson');
    parsedFields = JSON.parse(typeof raw === 'string' ? raw : '[]');
  } catch {
    return { error: 'Ungültige Feld-Daten.' };
  }

  const parsed = createCourseTypeSchema.safeParse({
    key: formData.get('key'),
    name: formData.get('name'),
    fields: parsedFields,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map((issue) => issue.message).join(' ') };
  }

  const result = await createCourseType(session.orgId, {
    key: parsed.data.key,
    name: parsed.data.name,
    schemaDefinition: {
      allowedBlockTypes: [{ type: 'content', fields: parsed.data.fields.map(toFieldDefinition) }],
    },
  });
  if ('error' in result) {
    return { error: 'Dieser Key wird bereits verwendet — bitte einen anderen wählen.' };
  }

  redirect('/settings/course-types');
}

export async function updateCourseTypeSchemaAction(
  courseTypeId: string,
  _prevState: CourseTypeFormState,
  formData: FormData,
): Promise<CourseTypeFormState> {
  const session = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  let parsedFields: unknown;
  try {
    const raw = formData.get('fieldsJson');
    parsedFields = JSON.parse(typeof raw === 'string' ? raw : '[]');
  } catch {
    return { error: 'Ungültige Feld-Daten.' };
  }

  const parsed = updateCourseTypeFieldsSchema.safeParse({
    name: formData.get('name'),
    fields: parsedFields,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map((issue) => issue.message).join(' ') };
  }

  const result = await updateCourseTypeSchema(courseTypeId, session.orgId, {
    name: parsed.data.name,
    schemaDefinition: {
      allowedBlockTypes: [{ type: 'content', fields: parsed.data.fields.map(toFieldDefinition) }],
    },
  });
  if ('error' in result) {
    return { error: 'Course-Type nicht gefunden.' };
  }

  redirect('/settings/course-types');
}
