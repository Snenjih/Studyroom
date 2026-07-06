'use client';

import { useActionState } from 'react';

import type { ProgramFormState } from '@/app/(app)/programs/actions';

interface ProgramFormProps {
  action: (prevState: ProgramFormState, formData: FormData) => Promise<ProgramFormState>;
  defaultValues?: { title: string; description: string | null };
  submitLabel: string;
}

export function ProgramForm({ action, defaultValues, submitLabel }: ProgramFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="title"
          className="font-mono text-[11px] uppercase tracking-wider text-zinc-500"
        >
          Titel
        </label>
        <input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          required
          className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
        {state?.fieldErrors?.title && (
          <p className="text-sm text-red-400">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="font-mono text-[11px] uppercase tracking-wider text-zinc-500"
        >
          Beschreibung
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description ?? ''}
          rows={4}
          className="resize-none rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
        {state?.fieldErrors?.description && (
          <p className="text-sm text-red-400">{state.fieldErrors.description[0]}</p>
        )}
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded bg-cyan-400 px-5 py-2 font-medium text-zinc-950 transition-colors hover:bg-cyan-300 disabled:opacity-50"
      >
        {pending ? 'Speichern…' : submitLabel}
      </button>
    </form>
  );
}
