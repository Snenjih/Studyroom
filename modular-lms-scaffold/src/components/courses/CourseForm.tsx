'use client';

import { useActionState, useState } from 'react';

import type { CourseFormState } from '@/app/(app)/courses/actions';

const COURSE_TYPE_DESCRIPTIONS: Record<string, string> = {
  'markdown-info': 'Statischer Lesestoff — Markdown-Blöcke, kein Quiz.',
  flashcards: 'Karteikarten zum Umdrehen — „Gewusst“ / „Nochmal“.',
  quiz: 'Multiple-Choice-Fragen mit automatischer Auswertung.',
};

interface CourseTypeOption {
  id: string;
  key: string;
  name: string;
}

interface CourseFormProps {
  action: (prevState: CourseFormState, formData: FormData) => Promise<CourseFormState>;
  submitLabel: string;
  defaultValues?: { title: string; description: string | null };
  courseTypeOptions?: CourseTypeOption[];
  currentCourseType?: { key: string; name: string };
}

export function CourseForm({
  action,
  submitLabel,
  defaultValues,
  courseTypeOptions,
  currentCourseType,
}: CourseFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [selectedTypeId, setSelectedTypeId] = useState(courseTypeOptions?.[0]?.id);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
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
          rows={3}
          className="resize-none rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
        {state?.fieldErrors?.description && (
          <p className="text-sm text-red-400">{state.fieldErrors.description[0]}</p>
        )}
      </div>

      {currentCourseType && (
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">Course-Type</p>
          <div className="flex w-fit items-center gap-2 rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="text-zinc-200">{currentCourseType.name}</span>
            <span className="font-mono text-[11px] text-zinc-600">
              (nach dem Anlegen nicht mehr änderbar)
            </span>
          </div>
        </div>
      )}

      {courseTypeOptions && (
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">Course-Type</p>
          <input type="hidden" name="courseTypeId" value={selectedTypeId ?? ''} />
          <div className="grid gap-3 sm:grid-cols-3">
            {courseTypeOptions.map((option) => {
              const isSelected = option.id === selectedTypeId;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedTypeId(option.id)}
                  className={`flex flex-col gap-1 rounded-lg border px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? 'border-cyan-500/60 bg-cyan-500/10'
                      : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] uppercase tracking-wider ${
                      isSelected ? 'text-cyan-300' : 'text-zinc-500'
                    }`}
                  >
                    {option.key}
                  </span>
                  <span className="text-sm font-medium text-zinc-100">{option.name}</span>
                  <span className="text-xs text-zinc-500">
                    {COURSE_TYPE_DESCRIPTIONS[option.key] ?? ''}
                  </span>
                </button>
              );
            })}
          </div>
          {state?.fieldErrors?.courseTypeId && (
            <p className="text-sm text-red-400">{state.fieldErrors.courseTypeId[0]}</p>
          )}
        </div>
      )}

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
