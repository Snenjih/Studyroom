# T012: Hartcodierte Course-Types als Seed-Daten anlegen

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T011

## Kontext
Konzept Abschnitt 10: "Bewusst mit hartcodierten Course-Types in Phase 2 planen — erst in
Phase 3 zum generischen Schema-System umbauen." Drei Typen: Markdown-Info, Flashcards,
einfaches Quiz.

## Ziel
Die drei Basis-Course-Types existieren in der `course_types`-Tabelle mit ihrer
`schema_definition`. Sie sind system-weit verfügbar (org_id = NULL).

## Schritte
- [ ] `schema_definition` für `markdown-info` definieren: erlaubt Block-Typ `markdown`
      mit Feldern `content` (string, required)
- [ ] `schema_definition` für `flashcards` definieren: erlaubt Block-Typ `flashcard`
      mit Feldern `front` (string), `back` (string)
- [ ] `schema_definition` für `quiz` definieren: erlaubt Block-Typ `quiz-question`
      mit Feldern `question`, `options` (array), `correct_index`
- [ ] `execution_engine`-Werte festlegen: `static` für Markdown, `quiz` für Flashcards
      und Quiz
- [ ] Seed-Skript (T008) um diese drei Einträge erweitern (idempotent)

## Abnahmekriterien
- [ ] Alle drei Course-Types sind nach `db:seed` in der DB (org_id = NULL)
- [ ] `schema_definition` ist valides JSON mit den beschriebenen Feldern
- [ ] Course-Type-Keys: `markdown-info`, `flashcards`, `quiz`
- [ ] Seed ist idempotent — kein Duplikat bei erneutem Ausführen

## Betroffene Dateien
- `src/db/seed.ts`
- `src/db/schema/course-types.ts` (ggf. ergänzen)

## Notizen
