// Default-Inhalt beim Anlegen eines neuen Blocks, je nach block_type (Konzept
// Abschnitt 3/10: die drei hartcodierten Course-Types aus T012). Generische
// Ableitung aus schema_definition folgt erst mit dem Type-Editor in Phase 3.
export function defaultBlockContent(blockType: string): Record<string, unknown> {
  switch (blockType) {
    case 'markdown':
      return { content: '' };
    case 'flashcard':
      return { front: '', back: '' };
    case 'quiz-question':
      return { question: '', options: ['', ''], correct_index: 0 };
    default:
      return {};
  }
}
