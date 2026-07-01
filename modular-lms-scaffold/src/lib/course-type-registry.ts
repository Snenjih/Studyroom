import type { ComponentType } from 'react';

import { FlashcardBlock } from '@/modules/course-types/flashcards/FlashcardBlock';
import { FlashcardEditor } from '@/modules/course-types/flashcards/FlashcardEditor';
import { MarkdownBlock } from '@/modules/course-types/markdown-info/MarkdownBlock';
import { MarkdownEditor } from '@/modules/course-types/markdown-info/MarkdownEditor';
import { QuizBlock } from '@/modules/course-types/quiz/QuizBlock';
import { QuizEditor } from '@/modules/course-types/quiz/QuizEditor';

// Lokal dupliziert statt aus '@/db/schema' importiert: dieses Modul wird von
// Client-Komponenten (Editoren/Renderer) erreicht, ein Typ-Import aus dem
// Schema-Barrel würde dessen zirkuläre Server-Modulgraphen unnötig in die
// Client-Bundle-Analyse hineinziehen.
export type BlockProgressStatus = 'not_started' | 'in_progress' | 'done' | 'failed';

export interface BlockProgressSummary {
  status: BlockProgressStatus;
  score: string | null;
  submissionData: unknown;
}

export interface RecordProgressInput {
  status: BlockProgressStatus;
  score?: number;
  submissionData?: unknown;
}

export interface BlockRendererProps {
  content: Record<string, unknown>;
  blockId: string;
  enrollmentId: string;
  progress: BlockProgressSummary | null;
  onComplete: (input: RecordProgressInput) => Promise<void>;
}

export interface BlockEditorProps {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}

export interface CourseTypeModule {
  renderer: ComponentType<BlockRendererProps>;
  editor: ComponentType<BlockEditorProps>;
}

// Registry-Objekt je Course-Type-Key (Konzept Abschnitt 2/3: Module registrieren sich
// hier). Wird von der Lern-Seite (Renderer) und vom Kurs-Editor (Editor) genutzt. Das
// generische Modul-Lade-System folgt erst in Phase 3 (T031).
export const courseTypeRegistry: Record<string, CourseTypeModule> = {
  'markdown-info': {
    renderer: MarkdownBlock,
    editor: MarkdownEditor,
  },
  flashcards: {
    renderer: FlashcardBlock,
    editor: FlashcardEditor,
  },
  quiz: {
    renderer: QuizBlock,
    editor: QuizEditor,
  },
};
