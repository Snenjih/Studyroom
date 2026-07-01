# T007: RBAC-Middleware und Permission-Checks implementieren

**Phase:** 01-foundation
**Status:** offen
**Abhängig von:** T006

## Kontext
Konzept Abschnitt 8: Permission-Format `"courses:create"` etc. Rollen-UI muss dynamisch
alle Permissions zeigen. Für Phase 1 zunächst statische Core-Permissions.

## Ziel
Eine `requirePermission()`-Funktion schützt API-Routes und Server-Actions. Rollenbasierte
Zugriffskontrolle funktioniert für die drei Basis-Rollen admin/trainer/learner.

## Schritte
- [ ] `src/lib/permissions.ts` — Core-Permission-Keys als TypeScript-Enum/Const-Object
- [ ] `src/lib/rbac.ts` — `getUserPermissions(userId)`: lädt alle Permissions eines Users
      (über user_roles → roles → role_permissions → permissions)
- [ ] `requirePermission(permission: string)` — wirft 403, wenn Permission fehlt
- [ ] `hasPermission(userId, permission)` — Boolean-Check für bedingte UI-Elemente
- [ ] Seed-Daten finalisieren: Basis-Rollen mit Standard-Permissions befüllen
- [ ] Admin-User in Seed (E-Mail + Passwort aus `.env`)

## Abnahmekriterien
- [ ] Ein Learner kann keine Admin-Route aufrufen (403)
- [ ] Ein Trainer kann Kurse anlegen (hat `courses:create`)
- [ ] Ein Admin hat alle Core-Permissions
- [ ] `getUserPermissions()` macht keine N+1-Queries (JOIN statt Loop)

## Betroffene Dateien
- `src/lib/permissions.ts`, `src/lib/rbac.ts` (neu)
- `src/db/seed.ts` (neu)

## Notizen
