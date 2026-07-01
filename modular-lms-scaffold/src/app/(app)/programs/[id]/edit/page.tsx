import { notFound } from 'next/navigation';

import { ProgramForm } from '@/components/programs/ProgramForm';
import { getProgram } from '@/lib/db/programs';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

import { updateProgramAction } from '../../actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProgramPage({ params }: PageProps) {
  const { id } = await params;
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.PROGRAMS_MANAGE))) notFound();

  const program = await getProgram(id, session.orgId);
  if (!program) notFound();

  const boundUpdateAction = updateProgramAction.bind(null, program.id);

  return (
    <div className="mx-auto max-w-lg">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/80">Programs</p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-100">Program bearbeiten</h1>
      <div className="mt-8">
        <ProgramForm
          action={boundUpdateAction}
          defaultValues={{ title: program.title, description: program.description }}
          submitLabel="Änderungen speichern"
        />
      </div>
    </div>
  );
}
