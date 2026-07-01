'use client';

import { useState, useTransition } from 'react';

import {
  deleteBlockAction,
  moveBlockAction,
  updateBlockContentAction,
} from '@/app/(app)/courses/actions';
import { ConfirmButton } from '@/components/ui/ConfirmButton';
import type {
  FlashcardBlockContent,
  MarkdownBlockContent,
  QuizQuestionBlockContent,
} from '@/db/schema/content-blocks';
import { courseTypeRegistry } from '@/lib/course-type-registry';

interface BlockRowProps {
  courseId: string;
  courseTypeKey: string;
  blockId: string;
  blockType: string;
  content: Record<string, unknown>;
  position: number;
  isFirst: boolean;
  isLast: boolean;
}

const BLOCK_TYPE_LABELS: Record<string, string> = {
  markdown: 'Markdown',
  flashcard: 'Flashcard',
  'quiz-question': 'Quiz-Frage',
};

export function BlockRow({
  courseId,
  courseTypeKey,
  blockId,
  blockType,
  content,
  isFirst,
  isLast,
}: BlockRowProps) {
  const [draft, setDraft] = useState(content);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await updateBlockContentAction(courseId, blockId, draft);
      setSaved(true);
    });
  }

  return (
    <li className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-400/80">
          {BLOCK_TYPE_LABELS[blockType] ?? blockType}
        </span>
        <div className="flex items-center gap-3 font-mono text-[12px] text-zinc-500">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => startTransition(() => moveBlockAction(courseId, blockId, 'up'))}
            className="transition-colors hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => startTransition(() => moveBlockAction(courseId, blockId, 'down'))}
            className="transition-colors hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↓
          </button>
          <ConfirmButton
            label="Entfernen"
            confirmTitle="Achtung"
            confirmMessage="Diesen Block wirklich entfernen? Bereits erfasster Lernfortschritt dazu geht verloren."
            confirmLabel="Entfernen"
            action={() => deleteBlockAction(courseId, blockId)}
          />
        </div>
      </div>

      <RegisteredOrFallbackEditor
        courseTypeKey={courseTypeKey}
        blockType={blockType}
        draft={draft}
        onChange={setDraft}
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {isPending ? 'Speichert…' : 'Speichern'}
        </button>
        {saved && !isPending && (
          <span className="font-mono text-[11px] text-cyan-400">gespeichert</span>
        )}
      </div>
    </li>
  );
}

interface RegisteredOrFallbackEditorProps {
  courseTypeKey: string;
  blockType: string;
  draft: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}

// Nutzt den registrierten Block-Editor aus dem course-type-registry, sobald einer
// existiert (T018+: markdown-info, später flashcards/quiz). Ansonsten Fallback auf die
// hier fest verdrahteten Felder — deckt auch zukünftige/eigene Course-Types generisch ab.
function RegisteredOrFallbackEditor({
  courseTypeKey,
  blockType,
  draft,
  onChange,
}: RegisteredOrFallbackEditorProps) {
  const registered = courseTypeRegistry[courseTypeKey]?.editor;
  if (registered) {
    const Editor = registered;
    return <Editor content={draft} onChange={onChange} />;
  }
  return <BlockContentFields blockType={blockType} draft={draft} onChange={onChange} />;
}

interface BlockContentFieldsProps {
  blockType: string;
  draft: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}

function BlockContentFields({ blockType, draft, onChange }: BlockContentFieldsProps) {
  if (blockType === 'markdown') {
    const value = draft as unknown as MarkdownBlockContent;
    return (
      <textarea
        rows={5}
        value={value.content ?? ''}
        onChange={(event) => onChange({ ...draft, content: event.target.value })}
        placeholder="Markdown-Inhalt…"
        className="w-full resize-none rounded border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
      />
    );
  }

  if (blockType === 'flashcard') {
    const value = draft as unknown as FlashcardBlockContent;
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[11px] text-zinc-500">Vorderseite</label>
          <textarea
            rows={3}
            value={value.front ?? ''}
            onChange={(event) => onChange({ ...draft, front: event.target.value })}
            className="resize-none rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[11px] text-zinc-500">Rückseite</label>
          <textarea
            rows={3}
            value={value.back ?? ''}
            onChange={(event) => onChange({ ...draft, back: event.target.value })}
            className="resize-none rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
          />
        </div>
      </div>
    );
  }

  if (blockType === 'quiz-question') {
    const value = draft as unknown as QuizQuestionBlockContent;
    const options = value.options ?? [];
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[11px] text-zinc-500">Frage</label>
          <input
            value={value.question ?? ''}
            onChange={(event) => onChange({ ...draft, question: event.target.value })}
            className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[11px] text-zinc-500">
            Optionen (richtige markieren)
          </label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${blockType}`}
                checked={value.correct_index === index}
                onChange={() => onChange({ ...draft, correct_index: index })}
                className="accent-cyan-400"
              />
              <span className="font-mono text-[11px] text-zinc-600">{index + 1}</span>
              <input
                value={option}
                onChange={(event) => {
                  const nextOptions = [...options];
                  nextOptions[index] = event.target.value;
                  onChange({ ...draft, options: nextOptions });
                }}
                className="flex-1 rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => {
                  const nextOptions = options.filter((_, i) => i !== index);
                  const nextCorrect =
                    value.correct_index === index
                      ? 0
                      : value.correct_index > index
                        ? value.correct_index - 1
                        : value.correct_index;
                  onChange({ ...draft, options: nextOptions, correct_index: nextCorrect });
                }}
                className="font-mono text-[11px] text-zinc-600 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...draft, options: [...options, ''] })}
            className="w-fit font-mono text-[11px] text-cyan-400 hover:text-cyan-300"
          >
            + Option hinzufügen
          </button>
        </div>
      </div>
    );
  }

  return (
    <textarea
      rows={4}
      value={JSON.stringify(draft, null, 2)}
      onChange={(event) => {
        try {
          onChange(JSON.parse(event.target.value));
        } catch {
          // Ungültiges JSON während des Tippens ignorieren, erst beim Speichern relevant.
        }
      }}
      className="w-full resize-none rounded border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 outline-none transition-colors focus:border-cyan-500"
    />
  );
}
