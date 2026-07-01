# T011: Drizzle-Schema für enrollments und block_progress anlegen

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T010

## Kontext
Konzept Abschnitt 4: Fortschritt ist strikt relational — Integrität ist hier kritisch.
`block_progress.submission_data JSONB` speichert Antworten, Code-Einreichungen etc.

## Ziel
Die Tabellen `enrollments` und `block_progress` existieren. Ein User kann in einen Kurs
eingeschrieben werden und Fortschritt pro Block kann gespeichert werden.

## Schritte
- [ ] `src/db/schema/enrollments.ts` — exakt nach Konzept: `id`, `user_id`, `course_id`,
      `status`, `started_at`, `completed_at`; UNIQUE(user_id, course_id)
- [ ] `src/db/schema/block-progress.ts` — `id`, `enrollment_id` (FK CASCADE), `block_id`,
      `status` (`not_started|in_progress|done|failed`), `attempts`, `score NUMERIC`,
      `submission_data JSONB`, `updated_at`
- [ ] Drizzle-Relations: enrollment → block_progress (1:n), enrollment → user/course
- [ ] Status-Enum als TypeScript-Union definieren (kein DB-Enum, string mit Validation)
- [ ] Migration generieren und ausführen

## Abnahmekriterien
- [ ] UNIQUE-Constraint auf `(user_id, course_id)` in `enrollments`
- [ ] `ON DELETE CASCADE` bei `enrollment_id` in `block_progress`
- [ ] Status-Werte sind typsicher (kein beliebiger String möglich)
- [ ] `submission_data JSONB` für variable Einreichungsdaten vorhanden

## Betroffene Dateien
- `src/db/schema/enrollments.ts`, `src/db/schema/block-progress.ts` (neu)
- `src/db/schema/index.ts`

## Notizen
