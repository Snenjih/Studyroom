# T011: Drizzle-Schema für enrollments und block_progress anlegen

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T010

## Kontext
Konzept Abschnitt 4: Fortschritt ist strikt relational — Integrität ist hier kritisch.
`block_progress.submission_data JSONB` speichert Antworten, Code-Einreichungen etc.

## Ziel
Die Tabellen `enrollments` und `block_progress` existieren. Ein User kann in einen Kurs
eingeschrieben werden und Fortschritt pro Block kann gespeichert werden.

## Schritte
- [x] `src/db/schema/enrollments.ts` — exakt nach Konzept: `id`, `user_id`, `course_id`,
      `status`, `started_at`, `completed_at`; UNIQUE(user_id, course_id)
- [x] `src/db/schema/block-progress.ts` — `id`, `enrollment_id` (FK CASCADE), `block_id`,
      `status` (`not_started|in_progress|done|failed`), `attempts`, `score NUMERIC`,
      `submission_data JSONB`, `updated_at`
- [x] Drizzle-Relations: enrollment → block_progress (1:n), enrollment → user/course
- [x] Status-Enum als TypeScript-Union definieren (kein DB-Enum, string mit Validation)
- [x] Migration generieren und ausführen

## Abnahmekriterien
- [x] UNIQUE-Constraint auf `(user_id, course_id)` in `enrollments`
- [x] `ON DELETE CASCADE` bei `enrollment_id` in `block_progress`
- [x] Status-Werte sind typsicher (kein beliebiger String möglich)
- [x] `submission_data JSONB` für variable Einreichungsdaten vorhanden

## Betroffene Dateien
- `src/db/schema/enrollments.ts`, `src/db/schema/block-progress.ts` (neu)
- `src/db/schema/index.ts`

## Notizen
Abweichend vom wörtlichen Konzept-SQL (das für `block_id` kein explizites `ON DELETE`
nennt) wurde `block_id` in `block_progress` mit `ON DELETE CASCADE` versehen: sonst
würde das Löschen eines einzelnen Content-Blocks (T017, Block entfernen) an bereits
existierendem Fortschritt scheitern. `enrollments.status` als TS-Union
(`active|completed|dropped`) definiert, da im Konzept nur der Default `active` und
`completed_at` explizit genannt sind. Migration `0007_redundant_roland_deschain.sql`
erstellt und angewendet.
