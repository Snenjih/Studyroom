# T027: Schema-Validierungsschicht für content_blocks

**Phase:** 03-module-system
**Status:** offen
**Abhängig von:** T026

## Kontext
Konzept Abschnitt 4: "`content` in `content_blocks` wird beim Speichern gegen
`course_types.schema_definition` geprüft." Validierung in der App-Schicht, nicht DB.

## Ziel
Das Speichern eines Content-Blocks validiert `block_type` und `content` gegen die
`schema_definition` des zugehörigen Course-Types. Ungültige Blöcke werden abgelehnt (400).

## Schritte
- [ ] `src/lib/db/courses.ts` — Block-Create/Update-Funktionen um Validierung erweitern:
      CourseType laden → schema_definition auslesen → `validateBlock()` aufrufen
- [ ] Fehlerformat standardisieren: `{ field: string, message: string }[]`
- [ ] API-Layer gibt 400 mit Validierungsfehlern zurück
- [ ] `src/lib/schema-definition/validator.ts` (T026) über Zod-Integration absichern
- [ ] Integrationstests: Block mit falschem Typ erstellen → 400 erwartet

## Abnahmekriterien
- [ ] POST /courses/:id/blocks mit falschem block_type gibt 400 zurück
- [ ] POST mit fehlendem Pflichtfeld gibt 400 mit Feldname zurück
- [ ] Gültiger Block wird gespeichert (200/201)
- [ ] Validierung läuft vor dem DB-INSERT (kein Rollback nötig)

## Betroffene Dateien
- `src/lib/db/courses.ts`
- `src/app/api/courses/[id]/blocks/route.ts`

## Notizen
