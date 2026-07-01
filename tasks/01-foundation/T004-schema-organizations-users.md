# T004: Drizzle-Schema für organizations und users anlegen

**Phase:** 01-foundation
**Status:** erledigt (2026-07-01)
**Abhängig von:** T003

## Kontext
Konzept Abschnitt 4 & 5: organizations-Tabelle von Anfang an einbauen (Single-Tenant,
aber org_id überall vorhanden für spätere SaaS-Option). Basis-Benutzertabelle.

## Ziel
Die Tabellen `organizations` und `users` existieren in der Datenbank mit korrekten Spalten,
Constraints und Foreign Keys. Migration ist angewendet.

## Schritte
- [x] `src/db/schema/organizations.ts` — Tabelle mit: `id`, `name`, `slug`, `created_at`
- [x] `src/db/schema/users.ts` — Tabelle mit: `id`, `org_id` (FK → organizations), `email`,
      `name`, `password_hash`, `created_at`, `updated_at`
- [x] Exports in `src/db/schema/index.ts` ergänzen
- [x] Migration generieren (`npm run db:generate`) und ausführen (`npm run db:migrate`)
- [x] Drizzle-Relations definieren (organizations → users)

## Abnahmekriterien
- [x] `organizations`-Tabelle in der DB vorhanden mit allen Spalten
- [x] `users`-Tabelle in der DB vorhanden, `org_id` FK auf `organizations.id`
- [x] TypeScript-Types für beide Tabellen automatisch inferiert (kein manuelles Tippen)
- [x] `npm run db:studio` zeigt beide Tabellen

## Betroffene Dateien
- `src/db/schema/organizations.ts` (neu)
- `src/db/schema/users.ts` (neu)
- `src/db/schema/index.ts`

## Notizen
- `email` (users) und `slug` (organizations) zusätzlich als `unique` markiert — nicht
  explizit in den Schritten gefordert, aber notwendig für Login (E-Mail als Identifier,
  relevant für T006) bzw. eindeutige URLs/Referenzen.
- `updated_at` nutzt `$onUpdate(() => new Date())`, damit die Spalte bei Änderungen
  tatsächlich fortgeschrieben wird statt dauerhaft dem `created_at`-Wert zu entsprechen.
- Placeholder-Tabelle `health_check` aus T003 entfernt (Zweck erfüllt) — als eigene
  Migration (`0002_hard_nuke.sql`, `DROP TABLE health_check`) generiert, getrennt von der
  Migration die `organizations`/`users` anlegt (`0001_complete_hedge_knight.sql`).
  Grund: `drizzle-kit generate` fragt interaktiv nach, ob ein gleichzeitiges Drop+Create
  eine Umbenennung sein könnte — das lässt sich in einer Nicht-TTY-Umgebung nicht
  beantworten, daher als zwei separate, eindeutige Migrationen generiert.
- Alle Abnahmekriterien real gegen eine Postgres-Instanz verifiziert (siehe Notiz zu T003
  bzgl. der lokal für Tests installierten, danach wieder gestoppten Postgres-Instanz).
