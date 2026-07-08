'use client';

import type { FieldDefinition } from '@/lib/schema-definition/types';

interface GenericBlockEditorProps {
  fields: FieldDefinition[];
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}

const inputClass =
  'rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500';

// Generischer Trainer-Editor für Custom-Course-Type-Blöcke (T028) — passende
// Eingabefelder je nach `FieldDefinition.type`, ohne dass dafür ein eigener
// Editor geschrieben werden muss (Konzept Abschnitt 3).
export function GenericBlockEditor({ fields, content, onChange }: GenericBlockEditorProps) {
  function setField(name: string, value: unknown) {
    onChange({ ...content, [name]: value });
  }

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            {field.label ?? field.name}
            {field.required && ' *'}
          </label>
          <FieldInput field={field} value={content[field.name]} onChange={(v) => setField(field.name, v)} />
        </div>
      ))}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDefinition;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  switch (field.type) {
    case 'text':
      return (
        <input
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      );
    case 'markdown':
      return (
        <textarea
          rows={6}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          className={`resize-none font-mono text-xs ${inputClass}`}
        />
      );
    case 'number':
      return (
        <input
          type="number"
          value={typeof value === 'number' ? value : ''}
          onChange={(event) => onChange(event.target.value === '' ? undefined : Number(event.target.value))}
          className={inputClass}
        />
      );
    case 'boolean':
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="accent-cyan-400"
        />
      );
    case 'select':
      return (
        <select
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Bitte wählen…
          </option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case 'array':
      return <ArrayInput itemType={field.itemType} value={value} onChange={onChange} />;
    default:
      return null;
  }
}

function ArrayInput({
  itemType,
  value,
  onChange,
}: {
  itemType: 'text' | 'number';
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const items = Array.isArray(value) ? value : [];

  function updateItem(index: number, raw: string) {
    const next = [...items];
    next[index] = itemType === 'number' ? Number(raw) : raw;
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, itemType === 'number' ? 0 : '']);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type={itemType === 'number' ? 'number' : 'text'}
            value={String(item)}
            onChange={(event) => updateItem(index, event.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="font-mono text-[11px] text-zinc-600 hover:text-red-400"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="w-fit font-mono text-[11px] text-cyan-400 hover:text-cyan-300"
      >
        + Eintrag hinzufügen
      </button>
    </div>
  );
}
