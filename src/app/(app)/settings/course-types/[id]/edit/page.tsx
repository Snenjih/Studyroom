import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CourseTypeForm } from '@/components/type-editor/CourseTypeForm';
import {
  countBlocksOnOutdatedVersion,
  getCourseTypeForOrg,
  isSystemCourseType,
} from '@/lib/db/course-types';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { toFieldRowDraft } from '@/lib/schemas/course-type';
import { requireSession } from '@/lib/session';

import { updateCourseTypeSchemaAction } from '../../actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCourseTypePage({ params }: PageProps) {
  const { id } = await params;
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.SETTINGS_MANAGE))) notFound();

  const courseType = await getCourseTypeForOrg(id, session.orgId);
  // System-Typen sind schreibgeschützt (T028-Abnahmekriterium) — keine Edit-Seite dafür.
  if (!courseType || isSystemCourseType(courseType)) notFound();

  const outdatedBlockCount = await countBlocksOnOutdatedVersion(courseType.id, courseType.version);
  const defaultFields = (courseType.schemaDefinition.allowedBlockTypes[0]?.fields ?? []).map(
    toFieldRowDraft,
  );
  const boundAction = updateCourseTypeSchemaAction.bind(null, courseType.id);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/settings/course-types"
        className="font-mono text-[11px] text-zinc-500 hover:text-zinc-300"
      >
        ← Course-Types
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-100">{courseType.name} bearbeiten</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Aktuelle Version: <span className="font-mono text-zinc-300">v{courseType.version}</span>.
        Speichern erzeugt eine neue Version — bestehende Blöcke bleiben gegen ihre bisherige
        Version gültig (kein automatisches Migrieren).
      </p>

      {outdatedBlockCount > 0 && (
        <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300">
          {outdatedBlockCount}{' '}
          {outdatedBlockCount === 1 ? 'bestehender Block nutzt' : 'bestehende Blöcke nutzen'} eine
          alte Version dieses Course-Types.
        </p>
      )}

      <div className="mt-8">
        <CourseTypeForm
          action={boundAction}
          defaultKey={courseType.key}
          defaultName={courseType.name}
          defaultFields={defaultFields}
          submitLabel="Neue Version speichern"
        />
      </div>
    </div>
  );
}
