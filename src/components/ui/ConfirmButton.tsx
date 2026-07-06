'use client';

import { useRef } from 'react';

interface ConfirmButtonProps {
  label: string;
  confirmTitle: string;
  confirmMessage: string;
  confirmLabel: string;
  action: () => Promise<void>;
  className?: string;
}

// Wiederverwendbarer Lösch-Bestätigungsdialog (natives <dialog>), ursprünglich für
// Programs (T016) gebaut, hier generalisiert für Courses/Blocks (T017).
export function ConfirmButton({
  label,
  confirmTitle,
  confirmMessage,
  confirmLabel,
  action,
  className,
}: ConfirmButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={
          className ?? 'font-mono text-[12px] text-zinc-500 transition-colors hover:text-red-400'
        }
      >
        {label}
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <p className="font-mono text-[11px] uppercase tracking-wider text-red-400">
          {confirmTitle}
        </p>
        <p className="mt-2 text-sm text-zinc-300">{confirmMessage}</p>
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
              await action();
              dialogRef.current?.close();
            }}
          >
            <button
              type="submit"
              className="rounded bg-red-500/90 px-3 py-1.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-red-400"
            >
              {confirmLabel}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
