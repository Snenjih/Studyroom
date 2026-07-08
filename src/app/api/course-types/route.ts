import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { createCourseType, listCourseTypesForOrg } from '@/lib/db/course-types';
import { PERMISSIONS } from '@/lib/permissions';
import { requirePermission } from '@/lib/rbac';
import { createCourseTypeSchema, toFieldDefinition } from '@/lib/schemas/course-type';
import { requireSession } from '@/lib/session';

export async function GET() {
  const session = await requireSession();
  const courseTypesForOrg = await listCourseTypesForOrg(session.orgId);
  return NextResponse.json(courseTypesForOrg);
}

export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
    const body = await request.json();
    const input = createCourseTypeSchema.parse(body);

    const result = await createCourseType(session.orgId, {
      key: input.key,
      name: input.name,
      schemaDefinition: { allowedBlockTypes: [{ type: 'content', fields: input.fields.map(toFieldDefinition) }] },
    });
    if ('error' in result) {
      return NextResponse.json({ error: 'Dieser Key wird bereits verwendet.' }, { status: 409 });
    }
    return NextResponse.json(result.courseType, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
