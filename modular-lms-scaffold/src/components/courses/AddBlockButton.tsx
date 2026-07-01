'use client';

import { useState, useTransition } from 'react';

import { addBlockAction } from '@/app/(app)/courses/actions';
import { defaultBlockContent } from '@/lib/block-defaults';

interface AllowedBlockType {
  type: string;
  fields: { name: string; type: string; required: boolean }[];
}

interface AddBlockButtonProps {
  courseId: string;
  allowedBlockTypes: AllowedBlockType[];
}

const BLOCK_TYPE_LABELS: Record<string, string> = {
  markdown: 'Markdown',
  flashcard: 'Flashcard',
  'quiz-question': 'Quiz-Frage',
};

export function AddBlockButton({ courseId, allowedBlockTypes }: AddBlockButtonProps) {
  const [selected, setSelected] = useState(allowedBlockTypes[0]?.type ?? '');
  const [isPending, startTransition] = useTransition();

  if (allowedBlockTypes.length === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20 px-4 py-3">
      <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        Block hinzufügen
      </span>
      <select
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
      >
        {allowedBlockTypes.map((blockType) => (
          <option key={blockType.type} value={blockType.type}>
            {BLOCK_TYPE_LABELS[blockType.type] ?? blockType.type}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={isPending || !selected}
        onClick={() =>
          startTransition(() => addBlockAction(courseId, selected, defaultBlockContent(selected)))
        }
        className="rounded bg-cyan-400 px-3 py-1.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-cyan-300 disabled:opacity-50"
      >
        {isPending ? 'Fügt hinzu…' : '+ Hinzufügen'}
      </button>
    </div>
  );
}
