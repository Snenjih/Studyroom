'use client';

import { useRef } from 'react';

import { deleteProgramAction } from '@/app/(app)/programs/actions';

interface DeleteProgramButtonProps {
  programId: string;
  programTitle: string;
}

export function DeleteProgramButton({ programId, programTitle }: DeleteProgramButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="font-mono text-[12px] text-zinc-500 transition-colors hover:text-red-400"
      >
        Löschen
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <p className="font-mono text-[11px] uppercase tracking-wider text-red-400">Achtung</p>
        <p className="mt-2 text-sm text-zinc-300">
          Program <span className="font-medium text-zinc-100">„{programTitle}“</span> wirklich
          löschen? Alle zugehörigen Courses werden mitgelöscht.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Abbrechen
          </button>
          <form
            action={async () => {
              await deleteProgramAction(programId);
              dialogRef.current?.close();
            }}
          >
            <button
              type="submit"
              className="rounded bg-red-500/90 px-3 py-1.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-red-400"
            >
              Endgültig löschen
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
