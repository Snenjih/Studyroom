# T007: RBAC-Middleware und Permission-Checks implementieren

**Phase:** 01-foundation
**Status:** erledigt (2026-07-01)
**Abhängig von:** T006

## Kontext
Konzept Abschnitt 8: Permission-Format `"courses:create"` etc. Rollen-UI muss dynamisch
alle Permissions zeigen. Für Phase 1 zunächst statische Core-Permissions.

## Ziel
Eine `requirePermission()`-Funktion schützt API-Routes und Server-Actions. Rollenbasierte
Zugriffskontrolle funktioniert für die drei Basis-Rollen admin/trainer/learner.

## Schritte
- [x] `src/lib/permissions.ts` — Core-Permission-Keys als TypeScript-Const-Object
- [x] `src/lib/rbac.ts` — `getUserPermissions(userId)`: lädt alle Permissions eines Users
      (über user_roles → roles → role_permissions → permissions)
- [x] `requirePermission(permission: string)` — wirft `ForbiddenError`, Aufrufer mappt das
      auf 403 (siehe Notizen)
- [x] `hasPermission(userId, permission)` — Boolean-Check für bedingte UI-Elemente
- [x] Seed-Daten finalisieren: Basis-Rollen mit Standard-Permissions befüllen
- [x] Admin-User in Seed (E-Mail + Passwort aus `.env`)

## Abnahmekriterien
- [x] Ein Learner kann keine Admin-Route aufrufen (403)
- [x] Ein Trainer kann Kurse anlegen (hat `courses:create`)
- [x] Ein Admin hat alle Core-Permissions
- [x] `getUserPermissions()` macht keine N+1-Queries (JOIN statt Loop)

## Betroffene Dateien
- `src/lib/permissions.ts`, `src/lib/rbac.ts` (neu)
- `src/lib/password.ts` (neu, siehe Notizen)
- `src/lib/auth.ts` (angepasst — nutzt jetzt `password.ts`)
- `src/db/seed.ts` (neu), `src/db/seed-data/base-roles.ts` (Permission-Zuweisung ergänzt)
- `src/db/schema/roles.ts` (Unique-Constraint `(org_id, name)` ergänzt, für idempotenten
  Seed nötig — neue Migration `0004_equal_spirit.sql`)
- `package.json` (`db:seed`-Script, `tsx` als Dev-Dependency)
- `.env.local`, `.env.example` (`ORG_NAME`, `ORG_SLUG`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`)

## Notizen
- Core-Permissions bewusst auf genau die Beispiele aus Konzept Abschnitt 8 begrenzt
  (`courses:create/edit:own/edit:any`, `users:manage`, `settings:manage`).
  `code:execute` bleibt explizit draußen — laut Konzept eine Modul-Permission
  (Phase 4), keine Core-Permission.
- `requirePermission()` wirft eine `ForbiddenError` statt selbst eine Response zu bauen
  (Route Handlers/Server Actions fangen sie und mappen auf 403) — folgt dem in den
  Next.js-16-Docs gezeigten Zwei-Stufen-Muster (Session-Check, dann Rollen-Check).
- **Abweichung/Bugfix während der Umsetzung:** `hashPassword` lag ursprünglich in
  `src/lib/auth.ts` hinter `import 'server-only'`. Das Seed-Skript läuft aber via `tsx`
  außerhalb des Next.js-Build-Kontexts, wo `server-only` immer wirft (gleiches Problem
  wie beim T006-Verifikationsskript). Deshalb `hashPassword`/`verifyPassword` nach
  `src/lib/password.ts` ausgelagert (kein `server-only`-Import), `auth.ts` nutzt es intern.
- `roles` hatte in T005 keinen Unique-Constraint auf `(org_id, name)`. Für ein
  idempotentes Seed-Skript (`onConflictDoUpdate`) ist das nötig — als kleine,
  korrekte Schema-Ergänzung nachgezogen (eine Rolle sollte ohnehin pro Org eindeutig
  benannt sein).
- `user_roles` hat laut T005 einen Unique-Constraint über `(user_id, role_id,
  scope_type, scope_id)` — Postgres behandelt NULL-Werte in Unique-Constraints aber als
  paarweise verschieden, d.h. `ON CONFLICT` greift bei zwei globalen (scope NULL)
  Zuweisungen nicht. Für die Admin-Rollenzuweisung im Seed daher expliziter
  Exists-Check vor dem Insert statt `onConflictDoNothing()`.
- Alle vier Abnahmekriterien real verifiziert: Seed zweimal laufen lassen → identische
  Zeilenzahlen (1 Org, 5 Permissions, 3 Rollen, 7 role_permissions, 1 Admin-User, 1
  Zuweisung); ein temporärer Test-Route-Handler (nicht Teil des Commits) mit
  `requirePermission(SETTINGS_MANAGE)`, per Playwright mit drei echten Logins
  (admin/trainer/learner) angefragt: admin → 200, trainer → 403, learner → 403;
  `EXPLAIN` auf der `getUserPermissions`-Query bestätigt einen einzelnen Join-Plan
  (kein N+1). Postgres/Dev-Server/Playwright danach wieder gestoppt, Testdaten
  zurückgesetzt.
