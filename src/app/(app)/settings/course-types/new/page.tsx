import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CourseTypeForm } from '@/components/type-editor/CourseTypeForm';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

import { createCourseTypeAction } from '../actions';

export default async function NewCourseTypePage() {
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.SETTINGS_MANAGE))) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/settings/course-types"
        className="font-mono text-[11px] text-zinc-500 hover:text-zinc-300"
      >
        ← Course-Types
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-100">Neuer Course-Type</h1>
      <div className="mt-8">
        <CourseTypeForm action={createCourseTypeAction} />
      </div>
    </div>
  );
}
