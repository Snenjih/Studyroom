# T005: Drizzle-Schema für roles und permissions anlegen

**Phase:** 01-foundation
**Status:** offen
**Abhängig von:** T004

## Kontext
Konzept Abschnitt 8: Klassisches RBAC — Role hat Permission-Liste, User hat 1..n Rollen
(global oder pro Program/Course-Scope). Erweiterbar zu ABAC, aber erstmal RBAC.

## Ziel
Die Tabellen `roles`, `permissions`, `role_permissions` und `user_roles` existieren
in der DB. Das RBAC-Grundmodell ist als Drizzle-Schema vollständig abgebildet.

## Schritte
- [ ] `src/db/schema/roles.ts` — `roles`: `id`, `org_id`, `name`, `description`, `created_at`
- [ ] `src/db/schema/permissions.ts` — `permissions`: `id`, `key` (z.B. `"courses:create"`),
      `description`, `module_key` (NULL = Core)
- [ ] `role_permissions`-Verbindungstabelle (FK: role_id, permission_id)
- [ ] `user_roles`-Verbindungstabelle (FK: user_id, role_id; optional: `scope_type`,
      `scope_id` für Program/Course-Scope)
- [ ] System-Basis-Rollen als Seed-Daten vorbereiten: `admin`, `trainer`, `learner`
- [ ] Drizzle-Relations für alle Tabellen definieren
- [ ] Migration generieren und ausführen

## Abnahmekriterien
- [ ] Alle 4 Tabellen existieren in der DB
- [ ] Ein User kann mehrere Rollen haben, eine Rolle mehrere Permissions
- [ ] `scope_type`/`scope_id` ermöglichen Program/Course-spezifische Rollenzuweisung
- [ ] TypeScript-Types vollständig inferiert

## Betroffene Dateien
- `src/db/schema/roles.ts`, `src/db/schema/permissions.ts` (neu)
- `src/db/schema/index.ts`

## Notizen
