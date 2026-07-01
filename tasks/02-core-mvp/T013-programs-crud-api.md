# T013: Programs-CRUD-API (Route Handlers)

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T012

## Kontext
Konzept Abschnitt 10 (Phase 1): Programs & Courses CRUD. API-Routes in Next.js
(App-Router Route Handlers). Permission-Check via RBAC aus T007.

## Ziel
Vollständige CRUD-Operationen für Programs sind über API-Routes verfügbar.
Erstellen/Bearbeiten/Löschen erfordert die Permission `programs:manage`.

## Schritte
- [x] `src/app/api/programs/route.ts` — GET (Liste), POST (erstellen)
- [x] `src/app/api/programs/[id]/route.ts` — GET (einzeln), PUT (aktualisieren), DELETE
- [x] Zod-Validierungsschema für Program-Create/Update in `src/lib/schemas/program.ts`
- [x] Permission-Check: `programs:manage` für POST/PUT/DELETE; GET ist für eingeloggte User
- [x] `programs:manage` zu Trainer/Admin-Permissions in Seed ergänzen
- [x] `src/lib/db/programs.ts` — Datenbankabfragen (DAL-Pattern)

## Abnahmekriterien
- [x] GET /api/programs gibt Programme der eigenen Org zurück (org_id-Filter!)
- [x] POST /api/programs erstellt ein neues Program (403 ohne Permission)
- [x] PUT /api/programs/:id aktualisiert, DELETE löscht
- [x] Zod-Validierungsfehler geben 400 mit verständlicher Fehlermeldung zurück

## Betroffene Dateien
- `src/app/api/programs/route.ts`, `src/app/api/programs/[id]/route.ts` (neu)
- `src/lib/schemas/program.ts`, `src/lib/db/programs.ts` (neu)

## Notizen
`zod` war bereits als Abhängigkeit vorhanden (v4). Neue Permission `courses:manage` direkt
mit ergänzt (wird von T014 benötigt), zusätzlich zu `programs:manage`. Gemeinsamer
Fehler-Mapper `src/lib/api-error.ts` neu eingeführt (ForbiddenError -> 403, ZodError -> 400),
wird auch in T014 wiederverwendet. Alle Endpunkte end-to-end gegen die lokale Postgres-
Instanz getestet (GET/POST/PUT/DELETE, Validierungsfehler, 403 ohne Permission, 404 nach
Löschen).
