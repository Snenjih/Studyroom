import Link from 'next/link';
import { notFound } from 'next/navigation';

import { deleteCourseAction, updateCourseAction } from '@/app/(app)/courses/actions';
import { AddBlockButton } from '@/components/courses/AddBlockButton';
import { BlockList } from '@/components/courses/BlockList';
import { CourseForm } from '@/components/courses/CourseForm';
import { ConfirmButton } from '@/components/ui/ConfirmButton';
import { getCourseWithBlocks } from '@/lib/db/courses';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  const { id: courseId } = await params;
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.COURSES_MANAGE))) notFound();

  const course = await getCourseWithBlocks(courseId, session.orgId);
  if (!course) notFound();

  const boundUpdateAction = updateCourseAction.bind(null, courseId, course.programId);
  const boundDeleteAction = deleteCourseAction.bind(null, courseId, course.programId);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12">
      <header className="flex items-start justify-between">
        <div>
          <Link
            href={`/programs/${course.programId}/courses`}
            className="font-mono text-[11px] text-zinc-500 hover:text-zinc-300"
          >
            ← Courses
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-100">{course.title}</h1>
        </div>
        <ConfirmButton
          label="Kurs löschen"
          confirmTitle="Achtung"
          confirmMessage="Diesen Kurs wirklich löschen? Alle Blöcke und Einschreibungen werden mitgelöscht."
          confirmLabel="Endgültig löschen"
          action={boundDeleteAction}
          className="font-mono text-[12px] text-zinc-500 transition-colors hover:text-red-400"
        />
      </header>

      <section>
        <h2 className="mb-4 font-mono text-sm uppercase tracking-wider text-zinc-400">Kursdaten</h2>
        <CourseForm
          action={boundUpdateAction}
          submitLabel="Änderungen speichern"
          defaultValues={{ title: course.title, description: course.description }}
          currentCourseType={{ key: course.courseType.key, name: course.courseType.name }}
        />
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm uppercase tracking-wider text-zinc-400">
          Content-Blöcke
        </h2>
        <div className="flex flex-col gap-4">
          <BlockList
            courseId={courseId}
            courseTypeKey={course.courseType.key}
            allowedBlockTypes={course.courseType.schemaDefinition.allowedBlockTypes}
            blocks={course.blocks}
          />
          <AddBlockButton
            courseId={courseId}
            allowedBlockTypes={course.courseType.schemaDefinition.allowedBlockTypes}
          />
        </div>
      </section>
    </div>
  );
}
