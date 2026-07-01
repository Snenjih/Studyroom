# T013: Programs-CRUD-API (Route Handlers)

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T012

## Kontext
Konzept Abschnitt 10 (Phase 1): Programs & Courses CRUD. API-Routes in Next.js
(App-Router Route Handlers). Permission-Check via RBAC aus T007.

## Ziel
Vollständige CRUD-Operationen für Programs sind über API-Routes verfügbar.
Erstellen/Bearbeiten/Löschen erfordert die Permission `programs:manage`.

## Schritte
- [ ] `src/app/api/programs/route.ts` — GET (Liste), POST (erstellen)
- [ ] `src/app/api/programs/[id]/route.ts` — GET (einzeln), PUT (aktualisieren), DELETE
- [ ] Zod-Validierungsschema für Program-Create/Update in `src/lib/schemas/program.ts`
- [ ] Permission-Check: `programs:manage` für POST/PUT/DELETE; GET ist für eingeloggte User
- [ ] `programs:manage` zu Trainer/Admin-Permissions in Seed ergänzen
- [ ] `src/lib/db/programs.ts` — Datenbankabfragen (DAL-Pattern)

## Abnahmekriterien
- [ ] GET /api/programs gibt Programme der eigenen Org zurück (org_id-Filter!)
- [ ] POST /api/programs erstellt ein neues Program (403 ohne Permission)
- [ ] PUT /api/programs/:id aktualisiert, DELETE löscht
- [ ] Zod-Validierungsfehler geben 400 mit verständlicher Fehlermeldung zurück

## Betroffene Dateien
- `src/app/api/programs/route.ts`, `src/app/api/programs/[id]/route.ts` (neu)
- `src/lib/schemas/program.ts`, `src/lib/db/programs.ts` (neu)

## Notizen
