import type { CourseTypeSchemaDefinition } from '@/db/schema/course-types';
import { BASE_COURSE_TYPES } from '@/db/seed-data/course-types';
import type { AppModule } from '@/lib/module-system';

import { MarkdownBlock } from './MarkdownBlock';
import { MarkdownEditor } from './MarkdownEditor';

// Schema-Definition kommt aus BASE_COURSE_TYPES (Single Source of Truth für Seed +
// Modul-Registrierung) — T026 formalisiert das Format eigenständig weiter.
const definition = BASE_COURSE_TYPES.find((courseType) => courseType.key === 'markdown-info');
if (!definition) throw new Error('markdown-info fehlt in BASE_COURSE_TYPES');

export const markdownInfoModule: AppModule = {
  key: 'markdown-info',
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
          schemaDefinition: definition.schemaDefinition as unknown as CourseTypeSchemaDefinition,
          renderer: MarkdownBlock,
          editor: MarkdownEditor,
        },
      ],
    };
  },
};
