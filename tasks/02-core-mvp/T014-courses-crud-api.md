# T014: Courses-CRUD-API (Route Handlers)

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T013

## Kontext
Konzept Abschnitt 3 & 4: Course gehört zu Program, hat `course_type_id` und
`config JSONB`. Content-Blöcke werden über separate Endpoints verwaltet.

## Ziel
Vollständige CRUD-Operationen für Courses inkl. ihrer Content-Blöcke sind über
API-Routes verfügbar.

## Schritte
- [ ] `src/app/api/programs/[programId]/courses/route.ts` — GET, POST
- [ ] `src/app/api/courses/[id]/route.ts` — GET (mit Blöcken), PUT, DELETE
- [ ] `src/app/api/courses/[id]/blocks/route.ts` — GET, POST (Block anlegen)
- [ ] `src/app/api/courses/[id]/blocks/[blockId]/route.ts` — PUT, DELETE, PATCH (position)
- [ ] Zod-Schema für Course + Block Create/Update
- [ ] `src/lib/db/courses.ts` — Datenbankabfragen inkl. Blöcke (geordnet nach position)
- [ ] `courses:manage` Permission prüfen

## Abnahmekriterien
- [ ] Kurs mit Blöcken laden gibt blocks sortiert nach `position` zurück
- [ ] Block-Reihenfolge kann via PATCH /blocks/:id geändert werden
- [ ] DELETE /courses/:id löscht cascading alle Blöcke (DB-Constraint)
- [ ] course_type_id muss auf existierenden Course-Type zeigen (404 wenn nicht vorhanden)

## Betroffene Dateien
- `src/app/api/programs/[programId]/courses/route.ts` (neu)
- `src/app/api/courses/[id]/route.ts`, `/blocks/route.ts`, `/blocks/[blockId]/route.ts` (neu)
- `src/lib/schemas/course.ts`, `src/lib/db/courses.ts` (neu)

## Notizen
