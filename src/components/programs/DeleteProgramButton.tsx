'use client';

import { deleteProgramAction } from '@/app/(app)/programs/actions';
import { ConfirmButton } from '@/components/ui/ConfirmButton';

interface DeleteProgramButtonProps {
  programId: string;
  programTitle: string;
}

export function DeleteProgramButton({ programId, programTitle }: DeleteProgramButtonProps) {
  return (
    <ConfirmButton
      label="Löschen"
      confirmTitle="Achtung"
      confirmMessage={`Program „${programTitle}“ wirklich löschen? Alle zugehörigen Courses werden mitgelöscht.`}
      confirmLabel="Endgültig löschen"
      action={() => deleteProgramAction(programId)}
    />
  );
}
