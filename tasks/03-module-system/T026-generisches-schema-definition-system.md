# T026: Generisches schema_definition-System für Course-Types

**Phase:** 03-module-system
**Status:** erledigt (2026-07-08)
**Abhängig von:** T025

## Kontext
Konzept Abschnitt 3 & 4: `course_types.schema_definition JSONB` definiert, welche
Felder/Block-Typen erlaubt sind. Validierung in der App-Schicht (nicht in der DB).

## Ziel
Ein formales JSON-Schema-Format für `schema_definition` ist definiert und dokumentiert.
Alle drei bestehenden Course-Types nutzen dieses Format.

## Schritte
- [x] `src/lib/schema-definition/types.ts` — TypeScript-Typen für `SchemaDefinition`,
      `FieldDefinition` (text, markdown, number, boolean, select, array)
- [x] `src/lib/schema-definition/field-types.ts` — alle erlaubten Feld-Typen mit
      Constraints (required, minLength, maxItems, etc.)
- [x] Beispiel-SchemaDefinition für alle drei Course-Types in Formal-Format umgeschrieben
- [x] `src/lib/schema-definition/validator.ts` — `validateBlock(block, schema): ValidationResult`
- [x] Unit-Tests: gültige und ungültige Blöcke gegen Schema testen

## Abnahmekriterien
- [x] `validateBlock()` gibt Fehler zurück wenn Pflichtfelder fehlen
- [x] `validateBlock()` gibt Fehler zurück wenn unbekannte block_type verwendet wird
- [x] Alle drei bestehenden Course-Types haben korrekte formale SchemaDefinitions
- [x] TypeScript-Types für SchemaDefinition sind vollständig (kein `any`)

## Betroffene Dateien
- `src/lib/schema-definition/` (neu)
- `src/modules/course-types/*/index.ts` (SchemaDefinitions angepasst)

## Notizen
- `db/schema/course-types.ts`: `CourseTypeSchemaDefinition` ist jetzt ein reiner
  Type-Alias auf `SchemaDefinition` aus `lib/schema-definition/types.ts` (statt einer
  eigenen Ad-hoc-Definition) — DB-Spalte (`schema_definition JSONB`) bleibt unverändert,
  nur der App-seitige Typ wurde vereinheitlicht.
- `src/db/seed-data/course-types.ts` (`BASE_COURSE_TYPES`) nutzt jetzt die formalen
  Feld-Typen (`text`/`markdown`/`number`/`array` statt `string`/`number`/`array`) und ist
  nicht mehr `as const` (die Literal-Typen kollidierten sonst mit dem mutable
  `SchemaDefinition`-Interface) — dadurch entfielen auch die `as unknown as
  CourseTypeSchemaDefinition`-Casts in `seed.ts` und den drei Modul-`index.ts`-Dateien.
- `validateBlock()` prüft je Feld-Typ passende Constraints (minLength/maxLength bei
  Text, min/max bei Zahl, minItems/maxItems + itemType bei Array, Optionsliste bei
  Select) — Zod-Integration als zusätzliche Absicherung ist explizit Aufgabe von T027.
- TypeScript-Compile, `npm test` (13/13) und `eslint` laufen fehlerfrei durch.
