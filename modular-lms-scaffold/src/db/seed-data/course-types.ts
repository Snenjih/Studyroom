// Hartcodierte Basis-Course-Types (Konzept Abschnitt 10, Phase 1 bewusst ohne
// generisches Schema-System). org_id = NULL => system-weit verfügbar.
// `schema_definition` beschreibt, welche Block-Typen mit welchen Feldern erlaubt
// sind — Validierung dagegen passiert in der App-Schicht (Konzept Abschnitt 4).
export const BASE_COURSE_TYPES = [
  {
    key: 'markdown-info',
    name: 'Markdown-Info',
    executionEngine: 'static',
    schemaDefinition: {
      allowedBlockTypes: [
        {
          type: 'markdown',
          fields: [{ name: 'content', type: 'string', required: true }],
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
            { name: 'front', type: 'string', required: true },
            { name: 'back', type: 'string', required: true },
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
            { name: 'question', type: 'string', required: true },
            { name: 'options', type: 'array', required: true },
            { name: 'correct_index', type: 'number', required: true },
          ],
        },
      ],
    },
  },
] as const;
