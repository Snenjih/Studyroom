// Formales Format für `course_types.schema_definition` (Konzept Abschnitt 3/4).
// Ersetzt das Ad-hoc-Format aus `db/schema/course-types.ts` (T012/T018) — dieses
// re-exportiert `SchemaDefinition` seit T026 nur noch als `CourseTypeSchemaDefinition`.
// Jeder Feld-Typ hat eigene Constraints, damit der Type-Editor (T028) und die
// Validierung (validator.ts) dieselbe Quelle nutzen.

interface BaseFieldDefinition {
  name: string;
  label?: string;
  required: boolean;
}

export interface TextFieldDefinition extends BaseFieldDefinition {
  type: 'text';
  minLength?: number;
  maxLength?: number;
}

export interface MarkdownFieldDefinition extends BaseFieldDefinition {
  type: 'markdown';
  minLength?: number;
}

export interface NumberFieldDefinition extends BaseFieldDefinition {
  type: 'number';
  min?: number;
  max?: number;
}

export interface BooleanFieldDefinition extends BaseFieldDefinition {
  type: 'boolean';
}

export interface SelectFieldDefinition extends BaseFieldDefinition {
  type: 'select';
  options: string[];
}

// Liste einfacher Skalarwerte (z.B. Quiz-Antwortoptionen) — kein verschachteltes
// Objekt-Array, das würde ein eigenes Sub-Schema brauchen (aktuell kein Use-Case).
export interface ArrayFieldDefinition extends BaseFieldDefinition {
  type: 'array';
  itemType: 'text' | 'number';
  minItems?: number;
  maxItems?: number;
}

export type FieldDefinition =
  | TextFieldDefinition
  | MarkdownFieldDefinition
  | NumberFieldDefinition
  | BooleanFieldDefinition
  | SelectFieldDefinition
  | ArrayFieldDefinition;

export type FieldTypeKey = FieldDefinition['type'];

export interface BlockTypeDefinition {
  type: string;
  fields: FieldDefinition[];
}

export interface SchemaDefinition {
  allowedBlockTypes: BlockTypeDefinition[];
}
