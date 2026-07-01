# T004: Drizzle-Schema für organizations und users anlegen

**Phase:** 01-foundation
**Status:** offen
**Abhängig von:** T003

## Kontext
Konzept Abschnitt 4 & 5: organizations-Tabelle von Anfang an einbauen (Single-Tenant,
aber org_id überall vorhanden für spätere SaaS-Option). Basis-Benutzertabelle.

## Ziel
Die Tabellen `organizations` und `users` existieren in der Datenbank mit korrekten Spalten,
Constraints und Foreign Keys. Migration ist angewendet.

## Schritte
- [ ] `src/db/schema/organizations.ts` — Tabelle mit: `id`, `name`, `slug`, `created_at`
- [ ] `src/db/schema/users.ts` — Tabelle mit: `id`, `org_id` (FK → organizations), `email`,
      `name`, `password_hash`, `created_at`, `updated_at`
- [ ] Exports in `src/db/schema/index.ts` ergänzen
- [ ] Migration generieren (`npm run db:generate`) und ausführen (`npm run db:migrate`)
- [ ] Drizzle-Relations definieren (organizations → users)

## Abnahmekriterien
- [ ] `organizations`-Tabelle in der DB vorhanden mit allen Spalten
- [ ] `users`-Tabelle in der DB vorhanden, `org_id` FK auf `organizations.id`
- [ ] TypeScript-Types für beide Tabellen automatisch inferiert (kein manuelles Tippen)
- [ ] `npm run db:studio` zeigt beide Tabellen

## Betroffene Dateien
- `src/db/schema/organizations.ts` (neu)
- `src/db/schema/users.ts` (neu)
- `src/db/schema/index.ts`

## Notizen
