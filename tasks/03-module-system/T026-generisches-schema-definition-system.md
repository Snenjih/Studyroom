# T026: Generisches schema_definition-System für Course-Types

**Phase:** 03-module-system
**Status:** offen
**Abhängig von:** T025

## Kontext
Konzept Abschnitt 3 & 4: `course_types.schema_definition JSONB` definiert, welche
Felder/Block-Typen erlaubt sind. Validierung in der App-Schicht (nicht in der DB).

## Ziel
Ein formales JSON-Schema-Format für `schema_definition` ist definiert und dokumentiert.
Alle drei bestehenden Course-Types nutzen dieses Format.

## Schritte
- [ ] `src/lib/schema-definition/types.ts` — TypeScript-Typen für `SchemaDefinition`,
      `FieldDefinition` (text, markdown, number, boolean, array, select, ...)
- [ ] `src/lib/schema-definition/field-types.ts` — alle erlaubten Feld-Typen mit
      Constraints (required, minLength, maxItems, etc.)
- [ ] Beispiel-SchemaDefinition für alle drei Course-Types in Formal-Format umschreiben
- [ ] `src/lib/schema-definition/validator.ts` — `validateBlock(block, schema): ValidationResult`
- [ ] Unit-Tests: gültige und ungültige Blöcke gegen Schema testen

## Abnahmekriterien
- [ ] `validateBlock()` gibt Fehler zurück wenn Pflichtfelder fehlen
- [ ] `validateBlock()` gibt Fehler zurück wenn unbekannte block_type verwendet wird
- [ ] Alle drei bestehenden Course-Types haben korrekte formale SchemaDefinitions
- [ ] TypeScript-Types für SchemaDefinition sind vollständig (kein `any`)

## Betroffene Dateien
- `src/lib/schema-definition/` (neu)
- `src/modules/course-types/*/index.ts` (SchemaDefinitions anpassen)

## Notizen
