import { notFound } from 'next/navigation';

import { createCourseAction } from '@/app/(app)/courses/actions';
import { CourseForm } from '@/components/courses/CourseForm';
import { listCourseTypes } from '@/lib/db/courses';
import { getProgram } from '@/lib/db/programs';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewCoursePage({ params }: PageProps) {
  const { id: programId } = await params;
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.COURSES_MANAGE))) notFound();

  const program = await getProgram(programId, session.orgId);
  if (!program) notFound();

  const courseTypeOptions = await listCourseTypes();
  const boundCreateAction = createCourseAction.bind(null, programId);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/80">
        {program.title}
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-100">Neuer Kurs</h1>
      <div className="mt-8">
        <CourseForm
          action={boundCreateAction}
          submitLabel="Kurs anlegen"
          courseTypeOptions={courseTypeOptions}
        />
      </div>
    </div>
  );
}
