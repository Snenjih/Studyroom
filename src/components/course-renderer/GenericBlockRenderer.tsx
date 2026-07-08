'use client';

import { useTransition } from 'react';
import Markdown from 'react-markdown';

import type {
  BlockProgressSummary,
  RecordProgressInput,
} from '@/lib/module-system';
import type { FieldDefinition } from '@/lib/schema-definition/types';

interface GenericBlockRendererProps {
  fields: FieldDefinition[];
  content: Record<string, unknown>;
  progress: BlockProgressSummary | null;
  onComplete: (input: RecordProgressInput) => Promise<void>;
}

// Zeigt Custom-Course-Type-Blöcke (T028) an, ohne dass ein eigener Renderer
// geschrieben werden muss (Konzept Abschnitt 3: Zwei-Stufen-System). Progress-Regel:
// "done" erst nach expliziter Bestätigung durch den Lernenden (erste Interaktion),
// nicht automatisch wie bei den statischen Basis-Typen.
export function GenericBlockRenderer({
  fields,
  content,
  progress,
  onComplete,
}: GenericBlockRendererProps) {
  const [isPending, startTransition] = useTransition();
  const isDone = progress?.status === 'done';

  function handleAcknowledge() {
    startTransition(() => onComplete({ status: 'done' }));
  }

  return (
    <div className="flex flex-col gap-5">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            {field.label ?? field.name}
          </span>
          <FieldValue field={field} value={content[field.name]} />
        </div>
      ))}

      {isDone ? (
        <p className="font-mono text-[11px] uppercase tracking-wider text-cyan-400">
          ✓ Abgeschlossen
        </p>
      ) : (
        <button
          type="button"
          disabled={isPending}
          onClick={handleAcknowledge}
          className="w-fit rounded bg-cyan-400 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-cyan-300 disabled:opacity-50"
        >
          {isPending ? 'Speichert…' : 'Abschließen'}
        </button>
      )}
    </div>
  );
}

function FieldValue({ field, value }: { field: FieldDefinition; value: unknown }) {
  if (value === undefined || value === null || value === '') {
    return <p className="text-sm italic text-zinc-600">—</p>;
  }

  if (field.type === 'markdown') {
    return (
      <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-headings:text-zinc-100">
        <Markdown>{String(value)}</Markdown>
      </div>
    );
  }

  if (field.type === 'boolean') {
    return <p className="text-zinc-200">{value ? 'Ja' : 'Nein'}</p>;
  }

  if (field.type === 'array' && Array.isArray(value)) {
    return (
      <ul className="list-inside list-disc text-zinc-200">
        {value.map((item, index) => (
          <li key={index}>{String(item)}</li>
        ))}
      </ul>
    );
  }

  return <p className="text-zinc-200">{String(value)}</p>;
}
