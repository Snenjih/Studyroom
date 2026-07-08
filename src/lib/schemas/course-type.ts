import { z } from 'zod';

import { FIELD_TYPE_KEYS } from '@/lib/schema-definition/field-types';
import type { FieldDefinition } from '@/lib/schema-definition/types';

const fieldTypeEnum = z.enum(FIELD_TYPE_KEYS as [string, ...string[]]);

// Rohes Formular-Format eines Feldes (T028 Type-Editor): `options`/`itemType` sind nur
// bei den passenden Feld-Typen relevant, siehe `toFieldDefinition()` unten für die
// Umwandlung in die diskriminierte `FieldDefinition`-Union aus T026.
const fieldRowSchema = z.object({
  name: z.string().trim().min(1, 'Feldname ist erforderlich.'),
  type: fieldTypeEnum,
  required: z.boolean(),
  options: z.string().optional(),
  itemType: z.enum(['text', 'number']).optional(),
});

export const createCourseTypeSchema = z
  .object({
    key: z
      .string()
      .trim()
      .min(1, 'Key ist erforderlich.')
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Nur Kleinbuchstaben, Zahlen und Bindestriche.'),
    name: z.string().trim().min(1, 'Name ist erforderlich.'),
    fields: z.array(fieldRowSchema).min(2, 'Mindestens 2 Felder sind erforderlich.'),
  })
  .superRefine((value, ctx) => {
    value.fields.forEach((field, index) => {
      if (field.type !== 'select') return;
      const options = parseOptions(field.options);
      if (options.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['fields', index, 'options'],
          message: 'Auswahl-Felder brauchen mindestens 2 Optionen (kommagetrennt).',
        });
      }
    });
  });

export type CreateCourseTypeInput = z.infer<typeof createCourseTypeSchema>;
export type FieldRowInput = z.infer<typeof fieldRowSchema>;

function parseOptions(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((option) => option.trim())
    .filter(Boolean);
}

// Wandelt eine Formular-Feldzeile in die formale `FieldDefinition` (T026) um —
// `options`/`itemType` werden nur für die Feld-Typen übernommen, die sie brauchen.
export function toFieldDefinition(row: FieldRowInput): FieldDefinition {
  const base = { name: row.name, required: row.required };
  switch (row.type) {
    case 'select':
      return { ...base, type: 'select', options: parseOptions(row.options) };
    case 'array':
      return { ...base, type: 'array', itemType: row.itemType ?? 'text' };
    case 'text':
      return { ...base, type: 'text' };
    case 'markdown':
      return { ...base, type: 'markdown' };
    case 'number':
      return { ...base, type: 'number' };
    case 'boolean':
      return { ...base, type: 'boolean' };
    default:
      throw new Error(`Unbekannter Feld-Typ: ${row.type}`);
  }
}
