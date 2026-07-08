import { BASE_COURSE_TYPES } from '@/db/seed-data/course-types';
import type { AppModule } from '@/lib/module-system';

import { QuizBlock } from './QuizBlock';
import { QuizEditor } from './QuizEditor';

const definition = BASE_COURSE_TYPES.find((courseType) => courseType.key === 'quiz');
if (!definition) throw new Error('quiz fehlt in BASE_COURSE_TYPES');

export const quizModule: AppModule = {
  key: 'quiz',
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
          renderer: QuizBlock,
          editor: QuizEditor,
        },
      ],
    };
  },
};
