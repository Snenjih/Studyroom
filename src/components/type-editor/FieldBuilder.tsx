'use client';

import type { FieldTypeKey } from '@/lib/schema-definition/types';

import { FieldTypeSelector } from './FieldTypeSelector';

export interface FieldRowDraft {
  name: string;
  type: FieldTypeKey;
  required: boolean;
  options: string;
  itemType: 'text' | 'number';
}

export function createEmptyField(): FieldRowDraft {
  return { name: '', type: 'text', required: true, options: '', itemType: 'text' };
}

interface FieldBuilderProps {
  fields: FieldRowDraft[];
  onChange: (next: FieldRowDraft[]) => void;
}

// Felder-Builder für den Type-Editor (Konzept Abschnitt 3: "Felder zusammenklicken
// ... → Type entsteht ohne Code"). Rein kontrolliert (fields/onChange) — die Serialisierung
// in ein Server-Action-taugliches Formular übernimmt der Aufrufer (CourseTypeForm).
export function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  function updateField(index: number, patch: Partial<FieldRowDraft>) {
    onChange(fields.map((field, i) => (i === index ? { ...field, ...patch } : field)));
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index));
  }

  function addField() {
    onChange([...fields, createEmptyField()]);
  }

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={field.name}
              onChange={(event) => updateField(index, { name: event.target.value })}
              placeholder="Feldname"
              className="min-w-[10rem] flex-1 rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
            />
            <FieldTypeSelector
              value={field.type}
              onChange={(type) => updateField(index, { type })}
            />
            <label className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(event) => updateField(index, { required: event.target.checked })}
                className="accent-cyan-400"
              />
              Pflichtfeld
            </label>
            <button
              type="button"
              onClick={() => removeField(index)}
              disabled={fields.length <= 1}
              className="font-mono text-[11px] text-zinc-600 transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ✕ Entfernen
            </button>
          </div>

          {field.type === 'select' && (
            <input
              value={field.options}
              onChange={(event) => updateField(index, { options: event.target.value })}
              placeholder="Optionen, kommagetrennt (mind. 2)"
              className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
            />
          )}

          {field.type === 'array' && (
            <label className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
              Listen-Einträge sind vom Typ
              <select
                value={field.itemType}
                onChange={(event) =>
                  updateField(index, { itemType: event.target.value as 'text' | 'number' })
                }
                className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
              >
                <option value="text">Text</option>
                <option value="number">Zahl</option>
              </select>
            </label>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addField}
        className="w-fit font-mono text-[11px] text-cyan-400 hover:text-cyan-300"
      >
        + Feld hinzufügen
      </button>
    </div>
  );
}
