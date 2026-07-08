import type { FieldDefinition } from '@/lib/schema-definition/types';

// Default-Inhalt beim Anlegen eines neuen Blocks, je nach block_type (Konzept
// Abschnitt 3/10: die drei hartcodierten Course-Types aus T012). Für Custom-Course-
// Types (T028/T029, kein hartcodierter Fall hier) wird der Default generisch aus den
// `FieldDefinition`s abgeleitet — sonst fehlen Pflichtfeld-Keys im `content`-Objekt
// komplett und `validateBlock()` (T027) lehnt den frisch angelegten Block sofort ab.
export function defaultBlockContent(
  blockType: string,
  fields?: FieldDefinition[],
): Record<string, unknown> {
  switch (blockType) {
    case 'markdown':
      return { content: '' };
    case 'flashcard':
      return { front: '', back: '' };
    case 'quiz-question':
      return { question: '', options: ['', ''], correct_index: 0 };
    default:
      return defaultGenericContent(fields);
  }
}

function defaultGenericContent(fields: FieldDefinition[] | undefined): Record<string, unknown> {
  if (!fields) return {};
  const content: Record<string, unknown> = {};
  for (const field of fields) {
    content[field.name] = defaultFieldValue(field);
  }
  return content;
}

function defaultFieldValue(field: FieldDefinition): unknown {
  switch (field.type) {
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'select':
      return field.options[0] ?? '';
    case 'array':
      return [];
    default:
      return '';
  }
}
