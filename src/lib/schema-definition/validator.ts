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

function isMissing(value: unknown): boolean {
  return value === undefined || value === null || value === '';
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
      const exhaustiveCheck: never = field;
      return exhaustiveCheck;
    }
  }
}

// Prüft `block.content` gegen die `schema_definition` des zugehörigen Course-Types
// (Konzept Abschnitt 4). Wird von der DB-Speicherschicht (T027) vor jedem
// Create/Update eines content_blocks aufgerufen.
export function validateBlock(block: BlockLike, schema: SchemaDefinition): ValidationResult {
  const blockTypeDef = schema.allowedBlockTypes.find((entry) => entry.type === block.blockType);
  if (!blockTypeDef) {
    return {
      valid: false,
      errors: [{ field: 'blockType', message: `Unbekannter Block-Typ: ${block.blockType}` }],
    };
  }

  const errors = blockTypeDef.fields.flatMap((field) =>
    validateField(field, block.content[field.name]),
  );
  return { valid: errors.length === 0, errors };
}
