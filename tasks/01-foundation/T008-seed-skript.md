# T008: Seed-Skript für Basis-Daten

**Phase:** 01-foundation
**Status:** erledigt (2026-07-01)
**Abhängig von:** T007

## Kontext
Konzept Abschnitt 5: Eine Organisation pro Instanz. Basis-Rollen (admin, trainer, learner)
und ein initialer Admin-User müssen beim ersten Start vorhanden sein.

## Ziel
`npm run db:seed` befüllt eine frische Datenbank mit einer Default-Organisation,
den drei Basis-Rollen, deren Core-Permissions und einem Admin-User.

## Schritte
- [x] `src/db/seed.ts` — Seed-Skript mit idempotenter Logik (läuft mehrfach ohne Fehler)
      — bereits in T007 gebaut, da T007 selbst seeded Testdaten für RBAC-Checks brauchte
- [x] Default-Organisation anlegen (`name`, `slug` aus ENV oder Fallback)
- [x] Core-Permissions eintragen (alle in `src/lib/permissions.ts` definierten Keys)
- [x] Rollen `admin`, `trainer`, `learner` anlegen + Permissions zuweisen
- [x] Admin-User anlegen (E-Mail + Passwort aus ENV: `ADMIN_EMAIL`, `ADMIN_PASSWORD`)
- [x] `package.json` Script: `db:seed`
- [x] Docker-Compose: separater `db-init`-Service (Dockerfile-Stage `migrator`), `app`
      wartet per `depends_on: condition: service_completed_successfully` darauf

## Abnahmekriterien
- [x] `npm run db:seed` läuft durch ohne Fehler
- [x] Admin-Login mit `ADMIN_EMAIL`/`ADMIN_PASSWORD` funktioniert nach Seed
- [x] Skript ist idempotent — zweimaliges Ausführen erzeugt keine Duplikate
- [x] `docker compose up` → Seed läuft automatisch auf einer frischen DB — Compose-Wiring
      umgesetzt und die exakte Befehlskette (`db:migrate && db:seed`) lokal gegen echtes
      Postgres verifiziert; `docker compose up` selbst konnte in dieser Sandbox nicht
      ausgeführt werden (Docker-Daemon lässt sich hier nicht starten, siehe Notizen)

## Betroffene Dateien
- `src/db/seed.ts` (bereits in T007 angelegt)
- `package.json` (bereits in T007: `db:seed`-Script)
- `Dockerfile` (neue Stage `migrator`), `docker-compose.yml` (neuer Service `db-init`)

## Notizen
- Der Großteil dieser Task (Seed-Logik selbst, Idempotenz, Rollen/Permissions/Admin-User,
  `package.json`-Script) wurde bereits während T007 gebaut, weil T007 ohne Testdaten
  seine eigenen Abnahmekriterien nicht hätte verifizieren können. T008 hat dadurch nur
  noch die Docker-Compose-Verdrahtung und die End-to-End-Verifikation aller vier
  Abnahmekriterien übernommen.
- **Docker-Compose-Verdrahtung:** neue Dockerfile-Stage `migrator` (baut auf `deps` auf,
  volles `node_modules` inkl. `drizzle-kit`/`tsx`, die im schlanken `runner`-Image bewusst
  fehlen) mit `CMD ["sh", "-c", "npm run db:migrate && npm run db:seed"]`. Neuer Service
  `db-init` in `docker-compose.yml` nutzt `build.target: migrator`, `app` hat
  `depends_on: db-init: condition: service_completed_successfully` — die App startet also
  nie, bevor Migration+Seed erfolgreich durchgelaufen sind. `restart: on-failure` analog
  zum bereits bestehenden `minio-init`-Muster in derselben Datei.
- `db:seed` nutzt `tsx --env-file-if-exists=.env.local` (nicht `--env-file`): lokal wird
  `.env.local` geladen, im Container ist die Datei nicht vorhanden (Secrets werden dort
  über `env_file:` in Compose injiziert, nicht als Datei ins Image kopiert) — mit
  `--env-file` würde das Skript im Container mit ENOENT abbrechen, `--env-file-if-exists`
  (Node 20.6+/22) überspringt das lautlos.
- **Bekannte Lücke:** `docker compose up` selbst konnte nicht ausgeführt werden — der
  Docker-Daemon lässt sich in dieser Sandbox nicht starten (`cpuset`-Verzeichnis liegt auf
  einem read-only-Dateisystem, typisch für verschachtelte/eingeschränkte
  Container-Umgebungen ohne privilegierten Modus). Stattdessen verifiziert: (1) beide
  Compose-Dateien sind syntaktisch valides YAML mit den erwarteten Service-Keys, (2) die
  exakte Befehlskette der `migrator`-Stage (`npm run db:migrate && npm run db:seed`) lief
  lokal gegen eine frisch geleerte Postgres-Instanz erfolgreich durch und war beim
  zweiten Lauf idempotent, (3) Admin-Login mit den `.env.local`-Werten (`ADMIN_EMAIL`/
  `ADMIN_PASSWORD`) funktioniert per Playwright-Test nach dem Seed. Ein echter
  `docker compose up`-Test auf einer Maschine mit funktionierendem Docker-Daemon steht
  noch aus — sollte vor dem produktiven Self-Hosting-Einsatz einmal nachgeholt werden.
