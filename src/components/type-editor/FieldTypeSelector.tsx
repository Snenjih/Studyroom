'use client';

import { FIELD_TYPES } from '@/lib/schema-definition/field-types';
import type { FieldTypeKey } from '@/lib/schema-definition/types';

interface FieldTypeSelectorProps {
  value: FieldTypeKey;
  onChange: (next: FieldTypeKey) => void;
}

export function FieldTypeSelector({ value, onChange }: FieldTypeSelectorProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as FieldTypeKey)}
      className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
    >
      {FIELD_TYPES.map((fieldType) => (
        <option key={fieldType.type} value={fieldType.type} title={fieldType.description}>
          {fieldType.label}
        </option>
      ))}
    </select>
  );
}
