import { z } from 'zod';

import type { FieldRowDraft } from '@/components/type-editor/FieldBuilder';
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

type FieldRowsValue = { fields: { type: string; options?: string }[] };

// Gemeinsame Cross-Field-Prüfung für Create + Update (T028/T032): select-Felder
// brauchen mindestens 2 (kommagetrennte) Optionen.
function checkSelectFieldOptions(value: FieldRowsValue, ctx: z.RefinementCtx): void {
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
}

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
  .superRefine(checkSelectFieldOptions);

// Der Key ist nach dem Anlegen unveränderlich (siehe CourseTypeForm: read-only im
// Edit-Modus) — Update betrifft nur Name + Felder, erzeugt aber eine neue Version
// (T032) statt den bestehenden Stand zu überschreiben.
export const updateCourseTypeFieldsSchema = z
  .object({
    name: z.string().trim().min(1, 'Name ist erforderlich.'),
    fields: z.array(fieldRowSchema).min(2, 'Mindestens 2 Felder sind erforderlich.'),
  })
  .superRefine(checkSelectFieldOptions);

export type CreateCourseTypeInput = z.infer<typeof createCourseTypeSchema>;
export type UpdateCourseTypeFieldsInput = z.infer<typeof updateCourseTypeFieldsSchema>;
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

// Umkehrung von `toFieldDefinition()` — Grundlage, um den Type-Editor (T028/T032) beim
// Bearbeiten eines bestehenden Course-Types mit den aktuellen Feldern vorzubefüllen.
export function toFieldRowDraft(field: FieldDefinition): FieldRowDraft {
  return {
    name: field.name,
    type: field.type,
    required: field.required,
    options: field.type === 'select' ? field.options.join(', ') : '',
    itemType: field.type === 'array' ? field.itemType : 'text',
  };
}
