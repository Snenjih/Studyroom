# T003: Drizzle ORM einrichten und Datenbankverbindung herstellen

**Phase:** 01-foundation
**Status:** erledigt (2026-07-01)
**Abhängig von:** T002

## Kontext
Konzept Abschnitt 4 & 7: Drizzle ORM als gewähltes ORM für Postgres. Besonders geeignet
für das Hybrid-Schema mit JSONB-Spalten (typsicher, SQL-nah).

## Ziel
Drizzle ORM ist eingerichtet, eine Datenbankverbindung besteht, und `drizzle-kit` ist für
Migrations konfiguriert. `npm run db:migrate` läuft durch.

## Schritte
- [x] `drizzle-orm`, `drizzle-kit`, `pg`/`postgres` installieren
- [x] `src/db/index.ts` — Datenbankverbindung (Connection-Pool via `postgres` oder `pg`)
- [x] `src/db/schema/index.ts` — Export-Einstiegspunkt für alle Schemas
- [x] `drizzle.config.ts` konfigurieren (Schema-Pfad, Migrations-Ausgabepfad, Datenbankverbindung)
- [x] `package.json` Scripts: `db:generate`, `db:migrate`, `db:studio`
- [x] Placeholder-Schema als Smoke-Test (z.B. leere Tabelle), Migration generieren und ausführen

## Abnahmekriterien
- [x] `npm run db:generate` generiert SQL-Migrationsdateien ohne Fehler
- [x] `npm run db:migrate` wendet Migrationen auf die Postgres-DB an
- [x] `npm run db:studio` öffnet Drizzle Studio (DB-Browser)
- [x] TypeScript kennt den Datenbanktypen — kein `any` in der DB-Verbindung

## Betroffene Dateien
- `src/db/index.ts`, `src/db/schema/index.ts`, `src/db/schema/health-check.ts`
- `drizzle.config.ts`, `package.json`

## Notizen
- `postgres` (postgres.js) als Treiber gewählt statt `pg` — schlankere API, gängige
  Kombination mit Drizzle in Next.js-Projekten.
- `dotenv` als Dev-Dependency ergänzt, da `drizzle.config.ts` explizit `.env.local`
  laden muss (Next.js-Konvention; drizzle-kit lädt sonst nur `.env`).
- Placeholder-Schema `health_check` (nur `id`, `checked_at`) dient rein als Smoke-Test
  für die Migration-Pipeline und wird in T004 durch die echten Kern-Tabellen ersetzt.
- Alle vier Abnahmekriterien wurden real gegen eine Postgres-Instanz verifiziert
  (kein Docker in dieser Sandbox verfügbar — testweise lokal via `apt`/systemd
  installiert, nach Verifikation wieder gestoppt). `db:generate` erzeugte
  `src/db/migrations/0000_good_maddog.sql`, `db:migrate` wandte sie erfolgreich an,
  `db:studio` startete ohne Fehler.
