# T012: Hartcodierte Course-Types als Seed-Daten anlegen

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T011

## Kontext
Konzept Abschnitt 10: "Bewusst mit hartcodierten Course-Types in Phase 2 planen — erst in
Phase 3 zum generischen Schema-System umbauen." Drei Typen: Markdown-Info, Flashcards,
einfaches Quiz.

## Ziel
Die drei Basis-Course-Types existieren in der `course_types`-Tabelle mit ihrer
`schema_definition`. Sie sind system-weit verfügbar (org_id = NULL).

## Schritte
- [x] `schema_definition` für `markdown-info` definieren: erlaubt Block-Typ `markdown`
      mit Feldern `content` (string, required)
- [x] `schema_definition` für `flashcards` definieren: erlaubt Block-Typ `flashcard`
      mit Feldern `front` (string), `back` (string)
- [x] `schema_definition` für `quiz` definieren: erlaubt Block-Typ `quiz-question`
      mit Feldern `question`, `options` (array), `correct_index`
- [x] `execution_engine`-Werte festlegen: `static` für Markdown, `quiz` für Flashcards
      und Quiz
- [x] Seed-Skript (T008) um diese drei Einträge erweitern (idempotent)

## Abnahmekriterien
- [x] Alle drei Course-Types sind nach `db:seed` in der DB (org_id = NULL)
- [x] `schema_definition` ist valides JSON mit den beschriebenen Feldern
- [x] Course-Type-Keys: `markdown-info`, `flashcards`, `quiz`
- [x] Seed ist idempotent — kein Duplikat bei erneutem Ausführen

## Betroffene Dateien
- `src/db/seed.ts`
- `src/db/schema/course-types.ts` (ggf. ergänzen)

## Notizen
`schema_definition` folgt einem einfachen `{ allowedBlockTypes: [{ type, fields: [{ name,
type, required }] }] }`-Format, das später (Phase 3, T026/T027) generisch validiert werden
kann, statt einer Ad-hoc-Struktur pro Typ. Seed getestet: zweifacher Lauf von `db:seed`
erzeugt weiterhin genau 3 Zeilen in `course_types` (via `onConflictDoUpdate` auf `key`).
