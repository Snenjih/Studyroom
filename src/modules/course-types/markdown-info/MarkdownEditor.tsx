'use client';

import { MarkdownBlock } from './MarkdownBlock';

interface MarkdownEditorProps {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const text = typeof content.content === 'string' ? content.content : '';

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Markdown
        </label>
        <textarea
          rows={10}
          value={text}
          onChange={(event) => onChange({ ...content, content: event.target.value })}
          placeholder="# Überschrift&#10;&#10;Text mit **fett**, Listen und `Code`…"
          className="resize-none rounded border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Vorschau
        </label>
        <div className="h-full max-h-[19rem] overflow-y-auto rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2">
          <MarkdownBlock content={{ content: text }} />
        </div>
      </div>
    </div>
  );
}
