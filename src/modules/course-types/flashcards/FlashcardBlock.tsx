'use client';

import { useState, useTransition } from 'react';

import type { BlockRendererProps } from '@/lib/course-type-registry';

interface FlashcardContent {
  front: string;
  back: string;
}

export function FlashcardBlock({ content, progress, onComplete }: BlockRendererProps) {
  const { front, back } = content as unknown as FlashcardContent;
  const [flipped, setFlipped] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<'known' | 'again' | null>(
    progress?.status === 'done' ? (Number(progress.score) >= 1 ? 'known' : 'again') : null,
  );

  function handleAnswer(known: boolean) {
    setResult(known ? 'known' : 'again');
    startTransition(() => onComplete({ status: 'done', score: known ? 1 : 0 }));
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {result && (
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
          Bereits beantwortet — {result === 'known' ? 'gewusst' : 'nochmal üben'}
        </p>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') setFlipped((f) => !f);
        }}
        className="h-56 w-full max-w-md cursor-pointer select-none [perspective:1200px]"
      >
        <div
          className={`relative h-full w-full rounded-xl transition-transform duration-500 ease-out [transform-style:preserve-3d] ${
            flipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center [backface-visibility:hidden]">
            <p className="text-lg text-zinc-100">{front || 'Leere Vorderseite'}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-cyan-500/40 bg-zinc-900 p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-lg text-cyan-200">{back || 'Leere Rückseite'}</p>
          </div>
        </div>
      </div>
      <p className="font-mono text-[11px] text-zinc-600">Klicken zum Umdrehen</p>

      {flipped && (
        <div className="flex gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleAnswer(false)}
            className="rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-red-500/50 hover:text-red-300 disabled:opacity-50"
          >
            Nochmal
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleAnswer(true)}
            className="rounded bg-cyan-400 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-cyan-300 disabled:opacity-50"
          >
            Gewusst
          </button>
        </div>
      )}
    </div>
  );
}
