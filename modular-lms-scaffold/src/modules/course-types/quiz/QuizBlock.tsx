'use client';

import { useState, useTransition } from 'react';

import type { BlockRendererProps } from '@/lib/course-type-registry';

interface QuizQuestionContent {
  question: string;
  options: string[];
  correct_index: number;
}

function getPreviousSelection(submissionData: unknown): number | null {
  if (
    submissionData &&
    typeof submissionData === 'object' &&
    'selected_index' in submissionData &&
    typeof (submissionData as { selected_index: unknown }).selected_index === 'number'
  ) {
    return (submissionData as { selected_index: number }).selected_index;
  }
  return null;
}

export function QuizBlock({ content, progress, onComplete }: BlockRendererProps) {
  const {
    question,
    options,
    correct_index: correctIndex,
  } = content as unknown as QuizQuestionContent;
  const previousSelection = getPreviousSelection(progress?.submissionData);

  const [selected, setSelected] = useState<number | null>(previousSelection);
  const [submitted, setSubmitted] = useState(previousSelection !== null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);
    const isCorrect = selected === correctIndex;
    startTransition(() =>
      onComplete({
        status: 'done',
        score: isCorrect ? 1 : 0,
        submissionData: { selected_index: selected },
      }),
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {submitted && (
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
          Bereits beantwortet
        </p>
      )}

      <p className="text-lg text-zinc-100">{question}</p>

      <div className="flex flex-col gap-2">
        {options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrectOption = index === correctIndex;

          let stateClasses = 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700';
          if (submitted) {
            if (isCorrectOption) {
              stateClasses = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200';
            } else if (isSelected) {
              stateClasses = 'border-red-500/50 bg-red-500/10 text-red-300';
            } else {
              stateClasses = 'border-zinc-800 bg-zinc-900/20 text-zinc-500';
            }
          } else if (isSelected) {
            stateClasses = 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200';
          }

          return (
            <label
              key={index}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors duration-300 ${stateClasses} ${
                submitted ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <input
                type="radio"
                name={`quiz-option-${question}`}
                disabled={submitted}
                checked={isSelected}
                onChange={() => setSelected(index)}
                className="accent-cyan-400"
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>

      {!submitted && (
        <button
          type="button"
          disabled={selected === null || isPending}
          onClick={handleSubmit}
          className="w-fit rounded bg-cyan-400 px-5 py-2 font-medium text-zinc-950 transition-colors hover:bg-cyan-300 disabled:opacity-50"
        >
          Antwort abschicken
        </button>
      )}

      {submitted && selected !== null && (
        <p
          className={`font-mono text-sm ${selected === correctIndex ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {selected === correctIndex
            ? 'Richtig!'
            : `Leider falsch — richtige Antwort: ${options[correctIndex]}`}
        </p>
      )}
    </div>
  );
}
