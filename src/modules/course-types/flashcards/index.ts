import { BASE_COURSE_TYPES } from '@/db/seed-data/course-types';
import type { AppModule } from '@/lib/module-system';

import { FlashcardBlock } from './FlashcardBlock';
import { FlashcardEditor } from './FlashcardEditor';

const definition = BASE_COURSE_TYPES.find((courseType) => courseType.key === 'flashcards');
if (!definition) throw new Error('flashcards fehlt in BASE_COURSE_TYPES');

export const flashcardsModule: AppModule = {
  key: 'flashcards',
  version: '1.0.0',
  register(config) {
    return {
      ...config,
      courseTypes: [
        ...config.courseTypes,
        {
          key: definition.key,
          name: definition.name,
          executionEngine: definition.executionEngine,
          schemaDefinition: definition.schemaDefinition,
          renderer: FlashcardBlock,
          editor: FlashcardEditor,
        },
      ],
    };
  },
};
