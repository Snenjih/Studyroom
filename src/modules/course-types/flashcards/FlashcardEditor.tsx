'use client';

interface FlashcardEditorProps {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}

export function FlashcardEditor({ content, onChange }: FlashcardEditorProps) {
  const front = typeof content.front === 'string' ? content.front : '';
  const back = typeof content.back === 'string' ? content.back : '';

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Vorderseite
        </label>
        <textarea
          rows={4}
          value={front}
          onChange={(event) => onChange({ ...content, front: event.target.value })}
          placeholder="Frage oder Begriff…"
          className="resize-none rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Rückseite
        </label>
        <textarea
          rows={4}
          value={back}
          onChange={(event) => onChange({ ...content, back: event.target.value })}
          placeholder="Antwort oder Erklärung…"
          className="resize-none rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
      </div>
    </div>
  );
}
