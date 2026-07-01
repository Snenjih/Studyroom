# T003: Drizzle ORM einrichten und Datenbankverbindung herstellen

**Phase:** 01-foundation
**Status:** offen
**Abhängig von:** T002

## Kontext
Konzept Abschnitt 4 & 7: Drizzle ORM als gewähltes ORM für Postgres. Besonders geeignet
für das Hybrid-Schema mit JSONB-Spalten (typsicher, SQL-nah).

## Ziel
Drizzle ORM ist eingerichtet, eine Datenbankverbindung besteht, und `drizzle-kit` ist für
Migrations konfiguriert. `npm run db:migrate` läuft durch.

## Schritte
- [ ] `drizzle-orm`, `drizzle-kit`, `pg`/`postgres` installieren
- [ ] `src/db/index.ts` — Datenbankverbindung (Connection-Pool via `postgres` oder `pg`)
- [ ] `src/db/schema/index.ts` — Export-Einstiegspunkt für alle Schemas
- [ ] `drizzle.config.ts` konfigurieren (Schema-Pfad, Migrations-Ausgabepfad, Datenbankverbindung)
- [ ] `package.json` Scripts: `db:generate`, `db:migrate`, `db:studio`
- [ ] Placeholder-Schema als Smoke-Test (z.B. leere Tabelle), Migration generieren und ausführen

## Abnahmekriterien
- [ ] `npm run db:generate` generiert SQL-Migrationsdateien ohne Fehler
- [ ] `npm run db:migrate` wendet Migrationen auf die Postgres-DB an
- [ ] `npm run db:studio` öffnet Drizzle Studio (DB-Browser)
- [ ] TypeScript kennt den Datenbanktypen — kein `any` in der DB-Verbindung

## Betroffene Dateien
- `src/db/index.ts`, `src/db/schema/index.ts`
- `drizzle.config.ts`, `package.json`

## Notizen
