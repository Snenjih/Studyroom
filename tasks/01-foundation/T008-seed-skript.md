# T008: Seed-Skript für Basis-Daten

**Phase:** 01-foundation
**Status:** offen
**Abhängig von:** T007

## Kontext
Konzept Abschnitt 5: Eine Organisation pro Instanz. Basis-Rollen (admin, trainer, learner)
und ein initialer Admin-User müssen beim ersten Start vorhanden sein.

## Ziel
`npm run db:seed` befüllt eine frische Datenbank mit einer Default-Organisation,
den drei Basis-Rollen, deren Core-Permissions und einem Admin-User.

## Schritte
- [ ] `src/db/seed.ts` — Seed-Skript mit idempotenter Logik (läuft mehrfach ohne Fehler)
- [ ] Default-Organisation anlegen (`name`, `slug` aus ENV oder Fallback)
- [ ] Core-Permissions eintragen (alle in `src/lib/permissions.ts` definierten Keys)
- [ ] Rollen `admin`, `trainer`, `learner` anlegen + Permissions zuweisen
- [ ] Admin-User anlegen (E-Mail + Passwort aus ENV: `ADMIN_EMAIL`, `ADMIN_PASSWORD`)
- [ ] `package.json` Script: `db:seed`
- [ ] Docker-Compose: Seed auf DB-Erststart ausführen (oder als separater `init`-Service)

## Abnahmekriterien
- [ ] `npm run db:seed` läuft durch ohne Fehler
- [ ] Admin-Login mit `ADMIN_EMAIL`/`ADMIN_PASSWORD` funktioniert nach Seed
- [ ] Skript ist idempotent — zweimaliges Ausführen erzeugt keine Duplikate
- [ ] `docker compose up` → Seed läuft automatisch auf einer frischen DB

## Betroffene Dateien
- `src/db/seed.ts` (neu)
- `package.json`, `docker-compose.yml`

## Notizen
