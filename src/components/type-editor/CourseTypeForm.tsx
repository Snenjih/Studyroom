'use client';

import { useActionState, useState } from 'react';

import type { CourseTypeFormState } from '@/app/(app)/settings/course-types/actions';

import { createEmptyField, FieldBuilder, type FieldRowDraft } from './FieldBuilder';

interface CourseTypeFormProps {
  action: (prevState: CourseTypeFormState, formData: FormData) => Promise<CourseTypeFormState>;
}

export function CourseTypeForm({ action }: CourseTypeFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [fields, setFields] = useState<FieldRowDraft[]>([createEmptyField(), createEmptyField()]);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <input type="hidden" name="fieldsJson" value={JSON.stringify(fields)} />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="key"
          className="font-mono text-[11px] uppercase tracking-wider text-zinc-500"
        >
          Key
        </label>
        <input
          id="key"
          name="key"
          required
          placeholder="z.b. projekt-reflexion"
          className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="font-mono text-[11px] uppercase tracking-wider text-zinc-500"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="z.B. Projekt-Reflexion"
          className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Felder (mind. 2)
        </span>
        <FieldBuilder fields={fields} onChange={setFields} />
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded bg-cyan-400 px-5 py-2 font-medium text-zinc-950 transition-colors hover:bg-cyan-300 disabled:opacity-50"
      >
        {pending ? 'Speichert…' : 'Course-Type anlegen'}
      </button>
    </form>
  );
}
