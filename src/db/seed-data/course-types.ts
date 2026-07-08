import type { SchemaDefinition } from '@/lib/schema-definition/types';

// Hartcodierte Basis-Course-Types (Konzept Abschnitt 10, Phase 1 bewusst ohne
// generisches Schema-System). org_id = NULL => system-weit verfügbar.
// `schemaDefinition` nutzt seit T026 das formale Format aus `lib/schema-definition/types.ts`
// — Validierung dagegen passiert in der App-Schicht (Konzept Abschnitt 4, `validateBlock()`).
interface BaseCourseType {
  key: string;
  name: string;
  executionEngine: string;
  schemaDefinition: SchemaDefinition;
}

export const BASE_COURSE_TYPES: BaseCourseType[] = [
  {
    key: 'markdown-info',
    name: 'Markdown-Info',
    executionEngine: 'static',
    schemaDefinition: {
      allowedBlockTypes: [
        {
          type: 'markdown',
          fields: [{ name: 'content', type: 'markdown', required: true }],
        },
      ],
    },
  },
  {
    key: 'flashcards',
    name: 'Flashcards',
    executionEngine: 'quiz',
    schemaDefinition: {
      allowedBlockTypes: [
        {
          type: 'flashcard',
          fields: [
            { name: 'front', type: 'text', required: true },
            { name: 'back', type: 'text', required: true },
          ],
        },
      ],
    },
  },
  {
    key: 'quiz',
    name: 'Einfaches Quiz',
    executionEngine: 'quiz',
    schemaDefinition: {
      allowedBlockTypes: [
        {
          type: 'quiz-question',
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'options', type: 'array', itemType: 'text', required: true, minItems: 2 },
            { name: 'correct_index', type: 'number', required: true, min: 0 },
          ],
        },
      ],
    },
  },
];
