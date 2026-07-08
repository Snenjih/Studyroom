import type { FieldTypeKey } from './types';

// Metadaten zu den erlaubten Feld-Typen — Grundlage für den Type-Editor
// (T028: `FieldTypeSelector.tsx`) und für lesbare Fehlermeldungen im Validator.
export interface FieldTypeMeta {
  type: FieldTypeKey;
  label: string;
  description: string;
}

export const FIELD_TYPES: FieldTypeMeta[] = [
  { type: 'text', label: 'Text', description: 'Einzeiliger oder kurzer Text.' },
  { type: 'markdown', label: 'Markdown', description: 'Formatierbarer Langtext (Markdown).' },
  { type: 'number', label: 'Zahl', description: 'Numerischer Wert.' },
  { type: 'boolean', label: 'Ja/Nein', description: 'Wahrheitswert (Checkbox).' },
  { type: 'select', label: 'Auswahl', description: 'Eine Option aus einer festen Liste.' },
  { type: 'array', label: 'Liste', description: 'Liste einfacher Text- oder Zahlenwerte.' },
];

export const FIELD_TYPE_KEYS = FIELD_TYPES.map((fieldType) => fieldType.type);

export function isFieldTypeKey(value: string): value is FieldTypeKey {
  return (FIELD_TYPE_KEYS as string[]).includes(value);
}
