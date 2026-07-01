'use client';

interface QuizEditorProps {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}

const MAX_OPTIONS = 4;

export function QuizEditor({ content, onChange }: QuizEditorProps) {
  const question = typeof content.question === 'string' ? content.question : '';
  const options = Array.isArray(content.options) ? (content.options as string[]) : [];
  const correctIndex = typeof content.correct_index === 'number' ? content.correct_index : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Frage
        </label>
        <input
          value={question}
          onChange={(event) => onChange({ ...content, question: event.target.value })}
          className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Optionen (richtige markieren)
        </label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              name="quiz-correct"
              checked={correctIndex === index}
              onChange={() => onChange({ ...content, correct_index: index })}
              className="accent-cyan-400"
            />
            <span className="font-mono text-[11px] text-zinc-600">{index + 1}</span>
            <input
              value={option}
              onChange={(event) => {
                const nextOptions = [...options];
                nextOptions[index] = event.target.value;
                onChange({ ...content, options: nextOptions });
              }}
              className="flex-1 rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={() => {
                const nextOptions = options.filter((_, i) => i !== index);
                const nextCorrect =
                  correctIndex === index
                    ? 0
                    : correctIndex > index
                      ? correctIndex - 1
                      : correctIndex;
                onChange({ ...content, options: nextOptions, correct_index: nextCorrect });
              }}
              className="font-mono text-[11px] text-zinc-600 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
        {options.length < MAX_OPTIONS && (
          <button
            type="button"
            onClick={() => onChange({ ...content, options: [...options, ''] })}
            className="w-fit font-mono text-[11px] text-cyan-400 hover:text-cyan-300"
          >
            + Option hinzufügen
          </button>
        )}
      </div>
    </div>
  );
}
