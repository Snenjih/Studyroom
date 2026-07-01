# T014: Courses-CRUD-API (Route Handlers)

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T013

## Kontext
Konzept Abschnitt 3 & 4: Course gehört zu Program, hat `course_type_id` und
`config JSONB`. Content-Blöcke werden über separate Endpoints verwaltet.

## Ziel
Vollständige CRUD-Operationen für Courses inkl. ihrer Content-Blöcke sind über
API-Routes verfügbar.

## Schritte
- [x] `src/app/api/programs/[id]/courses/route.ts` — GET, POST (Pfad-Parameter `programId` zu
      `id` umbenannt, siehe Notizen)
- [x] `src/app/api/courses/[id]/route.ts` — GET (mit Blöcken), PUT, DELETE
- [x] `src/app/api/courses/[id]/blocks/route.ts` — GET, POST (Block anlegen)
- [x] `src/app/api/courses/[id]/blocks/[blockId]/route.ts` — PUT, DELETE, PATCH (position)
- [x] Zod-Schema für Course + Block Create/Update
- [x] `src/lib/db/courses.ts` — Datenbankabfragen inkl. Blöcke (geordnet nach position)
- [x] `courses:manage` Permission prüfen

## Abnahmekriterien
- [x] Kurs mit Blöcken laden gibt blocks sortiert nach `position` zurück
- [x] Block-Reihenfolge kann via PATCH /blocks/:id geändert werden
- [x] DELETE /courses/:id löscht cascading alle Blöcke (DB-Constraint)
- [x] course_type_id muss auf existierenden Course-Type zeigen (404 wenn nicht vorhanden)

## Betroffene Dateien
- `src/app/api/programs/[id]/courses/route.ts` (neu)
- `src/app/api/courses/[id]/route.ts`, `/blocks/route.ts`, `/blocks/[blockId]/route.ts` (neu)
- `src/lib/schemas/course.ts`, `src/lib/db/courses.ts` (neu)

## Notizen
Next.js erlaubt keine unterschiedlichen Slug-Namen für denselben Pfad-Segment-Level: da
T013 bereits `src/app/api/programs/[id]/route.ts` anlegt, musste die in der Task
vorgeschlagene Route `programs/[programId]/courses` auf `programs/[id]/courses`
umbenannt werden (führte beim Test zu einem harten Next.js-Fehler "different slug names
for the same dynamic path", der den gesamten Dev-Server zum Absturz brachte). `org_id`-
Scoping für Courses/Blocks läuft über einen Join auf `programs`, da `courses` selbst
keine `org_id`-Spalte hat. Block-Position wird beim Anlegen automatisch als
`max(position)+1` vergeben. Alle Endpunkte (inkl. Cascade-Löschung, Reorder per PATCH,
404 bei ungültigem course_type_id) end-to-end gegen die lokale Postgres-Instanz getestet.
