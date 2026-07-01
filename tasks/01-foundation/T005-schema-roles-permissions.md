# T005: Drizzle-Schema für roles und permissions anlegen

**Phase:** 01-foundation
**Status:** erledigt (2026-07-01)
**Abhängig von:** T004

## Kontext
Konzept Abschnitt 8: Klassisches RBAC — Role hat Permission-Liste, User hat 1..n Rollen
(global oder pro Program/Course-Scope). Erweiterbar zu ABAC, aber erstmal RBAC.

## Ziel
Die Tabellen `roles`, `permissions`, `role_permissions` und `user_roles` existieren
in der DB. Das RBAC-Grundmodell ist als Drizzle-Schema vollständig abgebildet.

## Schritte
- [x] `src/db/schema/roles.ts` — `roles`: `id`, `org_id`, `name`, `description`, `created_at`
- [x] `src/db/schema/permissions.ts` — `permissions`: `id`, `key` (z.B. `"courses:create"`),
      `description`, `module_key` (NULL = Core)
- [x] `role_permissions`-Verbindungstabelle (FK: role_id, permission_id)
- [x] `user_roles`-Verbindungstabelle (FK: user_id, role_id; optional: `scope_type`,
      `scope_id` für Program/Course-Scope)
- [x] System-Basis-Rollen als Seed-Daten vorbereiten: `admin`, `trainer`, `learner`
- [x] Drizzle-Relations für alle Tabellen definieren
- [x] Migration generieren und ausführen

## Abnahmekriterien
- [x] Alle 4 Tabellen existieren in der DB
- [x] Ein User kann mehrere Rollen haben, eine Rolle mehrere Permissions
- [x] `scope_type`/`scope_id` ermöglichen Program/Course-spezifische Rollenzuweisung
- [x] TypeScript-Types vollständig inferiert

## Betroffene Dateien
- `src/db/schema/roles.ts`, `src/db/schema/permissions.ts`,
  `src/db/schema/role-permissions.ts`, `src/db/schema/user-roles.ts` (neu)
- `src/db/schema/index.ts`, `src/db/schema/organizations.ts`, `src/db/schema/users.ts`
  (Relations ergänzt)
- `src/db/seed-data/base-roles.ts` (neu, Vorbereitung für T008)

## Notizen
- `role_permissions` nutzt eine zusammengesetzte Primary Key (`role_id`, `permission_id`)
  statt einer surrogaten `id` — reine m:n-Verbindungstabelle ohne eigene Attribute.
- `user_roles` hat einen Unique-Constraint über `(user_id, role_id, scope_type, scope_id)`,
  damit dieselbe Rollenzuweisung nicht doppelt existieren kann; globale (`scope_type
  NULL`) und gescopte Zuweisungen derselben Rolle für denselben User sind trotzdem beide
  möglich, da NULL in unique-Constraints in Postgres nicht als "gleich" zählt.
- `admin`/`trainer`/`learner` als Basis-Rollen nur als Datenkonstante in
  `src/db/seed-data/base-roles.ts` vorbereitet (Task-Vorgabe: "vorbereiten"), noch kein
  ausführbares Skript — das ist explizit T008.
- Alle Abnahmekriterien real gegen Postgres verifiziert, inkl. Insert-Test: ein User mit
  drei Rollenzuweisungen (davon eine program-gescoped) und eine Rolle mit zwei
  Permissions (siehe Testdaten in der Session, nicht Teil des Commits).
