import { notFound } from 'next/navigation';

import { ProgramForm } from '@/components/programs/ProgramForm';
import { PERMISSIONS } from '@/lib/permissions';
import { hasPermission } from '@/lib/rbac';
import { requireSession } from '@/lib/session';

import { createProgramAction } from '../actions';

export default async function NewProgramPage() {
  const session = await requireSession();
  if (!(await hasPermission(session.userId, PERMISSIONS.PROGRAMS_MANAGE))) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/80">Programs</p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-100">Neues Program</h1>
      <div className="mt-8">
        <ProgramForm action={createProgramAction} submitLabel="Program anlegen" />
      </div>
    </div>
  );
}
