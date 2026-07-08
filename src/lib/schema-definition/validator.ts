import { z } from 'zod';

import type { FieldDefinition, SchemaDefinition } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface BlockLike {
  blockType: string;
  content: Record<string, unknown>;
}

// Zod-Absicherung der äußeren Block-Hülle (Konzept Abschnitt 4: Validierung "z.B. mit
// zod ... in der App-Schicht"): schützt vor grob falsch geformtem Input (z.B. `content`
// ist kein Objekt), BEVOR die feldweise Prüfung unten überhaupt anfängt. Die
// feldweise Prüfung selbst bleibt hand-geschrieben, da sie eng an das dynamische
// `FieldDefinition`-Format gekoppelt ist (Feld-Typ pro Course-Type, nicht vorab bekannt).
const blockEnvelopeSchema = z.object({
  blockType: z.string().min(1),
  content: z.record(z.string(), z.unknown()),
});

// Bewusst NUR undefined/null als "fehlt" gewertet, nicht leere Strings: neu über
// AddBlockButton angelegte Blöcke starten mit leeren Default-Werten
// (`defaultBlockContent()`) und werden erst danach im Editor befüllt — ein leerer,
// aber vorhandener Pflicht-Feldwert darf das erste Speichern nicht mit 400 blockieren.
function isMissing(value: unknown): boolean {
  return value === undefined || value === null;
}

function validateField(field: FieldDefinition, value: unknown): ValidationError[] {
  if (isMissing(value)) {
    return field.required ? [{ field: field.name, message: 'Pflichtfeld fehlt.' }] : [];
  }

  switch (field.type) {
    case 'text':
    case 'markdown': {
      if (typeof value !== 'string') {
        return [{ field: field.name, message: 'Muss ein Text sein.' }];
      }
      const errors: ValidationError[] = [];
      if (field.minLength !== undefined && value.length < field.minLength) {
        errors.push({
          field: field.name,
          message: `Muss mindestens ${field.minLength} Zeichen haben.`,
        });
      }
      if (field.type === 'text' && field.maxLength !== undefined && value.length > field.maxLength) {
        errors.push({
          field: field.name,
          message: `Darf höchstens ${field.maxLength} Zeichen haben.`,
        });
      }
      return errors;
    }
    case 'number': {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        return [{ field: field.name, message: 'Muss eine Zahl sein.' }];
      }
      const errors: ValidationError[] = [];
      if (field.min !== undefined && value < field.min) {
        errors.push({ field: field.name, message: `Muss mindestens ${field.min} sein.` });
      }
      if (field.max !== undefined && value > field.max) {
        errors.push({ field: field.name, message: `Darf höchstens ${field.max} sein.` });
      }
      return errors;
    }
    case 'boolean': {
      if (typeof value !== 'boolean') {
        return [{ field: field.name, message: 'Muss true oder false sein.' }];
      }
      return [];
    }
    case 'select': {
      if (typeof value !== 'string' || !field.options.includes(value)) {
        return [{ field: field.name, message: `Muss einer von: ${field.options.join(', ')} sein.` }];
      }
      return [];
    }
    case 'array': {
      if (!Array.isArray(value)) {
        return [{ field: field.name, message: 'Muss eine Liste sein.' }];
      }
      const errors: ValidationError[] = [];
      if (field.minItems !== undefined && value.length < field.minItems) {
        errors.push({
          field: field.name,
          message: `Muss mindestens ${field.minItems} Einträge haben.`,
        });
      }
      if (field.maxItems !== undefined && value.length > field.maxItems) {
        errors.push({
          field: field.name,
          message: `Darf höchstens ${field.maxItems} Einträge haben.`,
        });
      }
      const expectedItemType = field.itemType === 'number' ? 'number' : 'string';
      if (value.some((item) => typeof item !== expectedItemType)) {
        errors.push({
          field: field.name,
          message: `Alle Einträge müssen vom Typ ${field.itemType} sein.`,
        });
      }
      return errors;
    }
    default: {
      // Laufzeit-Absicherung: `field` sollte laut Typ hier `never` sein, aber
      // `schema_definition` kommt aus der DB (JSONB) — ein unbekannter/veralteter
      // Feld-Typ (z.B. aus einer nicht neu geseedeten oder manuell editierten Zeile)
      // muss als Validierungsfehler auffallen, statt eine falsch geformte Rückgabe
      // an `flatMap()` weiterzureichen.
      const unknownField = field as { name: string; type: string };
      return [
        { field: unknownField.name, message: `Unbekannter Feld-Typ: ${unknownField.type}` },
      ];
    }
  }
}

// Prüft `block.content` gegen die `schema_definition` des zugehörigen Course-Types
// (Konzept Abschnitt 4). Wird von der DB-Speicherschicht (T027) vor jedem
// Create/Update eines content_blocks aufgerufen.
export function validateBlock(block: BlockLike, schema: SchemaDefinition): ValidationResult {
  const envelope = blockEnvelopeSchema.safeParse(block);
  if (!envelope.success) {
    return {
      valid: false,
      errors: envelope.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'block',
        message: issue.message,
      })),
    };
  }

  const blockTypeDef = schema.allowedBlockTypes.find(
    (entry) => entry.type === envelope.data.blockType,
  );
  if (!blockTypeDef) {
    return {
      valid: false,
      errors: [{ field: 'blockType', message: `Unbekannter Block-Typ: ${envelope.data.blockType}` }],
    };
  }

  const errors = blockTypeDef.fields.flatMap((field) =>
    validateField(field, envelope.data.content[field.name]),
  );
  return { valid: errors.length === 0, errors };
}
