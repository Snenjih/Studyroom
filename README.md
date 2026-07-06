# Studyroom — Modulare Learning-Plattform

Selbstgehostete, Docker-basierte Lernplattform (vergleichbar ClassroomIO), aber mit
vollständig frei definierbaren Course-Typen als wiederverwendbare Templates. Gebaut mit
Next.js, Postgres, Redis und MinIO.

Vollständiges Architektur-Konzept: [`docs/CONCEPT.md`](docs/CONCEPT.md) — Quelle der
Wahrheit für alle Architektur-Entscheidungen.

## Projektstruktur

```
CLAUDE.md                    Persistente Instruktionen für Claude Code (Konzept, Workflow, Tech-Stack)
AGENTS.md                    Hinweis zur eingesetzten Next.js-Version (Breaking Changes ggü. älteren Versionen)
docs/CONCEPT.md              Vollständiges Architektur-Konzept — Quelle der Wahrheit
tasks/                        Granulare, einzeln abarbeitbare Tasks
  progress.md                 Gesamtübersicht / Fortschritt
  TASK_TEMPLATE.md             Struktur jeder Task-Datei
  00-bootstrap/ ... 07-self-hosting-reife/   Task-Dateien je Phase
.claude/commands/next-task.md   Der /next-task-Workflow

src/app/                      Next.js App Router (Routen, Layouts, API-Route-Handler)
src/components/               UI-Komponenten (Dashboard, Courses, Programs, Settings, ...)
src/db/                        Drizzle-Schema, Migrationen, Seed-Daten
src/lib/                       Geteilte Utilities, Zod-Schemas, DB-Helper
src/modules/course-types/      Eingebaute Course-Type-Module (Markdown-Info, Flashcards, Quiz, ...)

Dockerfile                    Multi-Stage-Build (deps → builder → migrator / runner)
docker-compose.yml            Produktions-Stack (App, Postgres, Redis, MinIO, DB-Init)
docker-compose.dev.yml        Overlay für Hot-Reload-Entwicklung
.env.example                  Vorlage für alle benötigten Umgebungsvariablen
scripts/bump-version.sh       Hilfsskript zum Hochzählen der Version vor einem Release
```

## Voraussetzungen

- [Docker](https://docs.docker.com/get-docker/) und Docker Compose v2 (`docker compose version`)
- Für lokale Entwicklung ohne Container zusätzlich: Node.js 22+ und npm
- Für den `/next-task`-Workflow: [Claude Code](https://claude.com/claude-code) im Projektverzeichnis

Kein weiteres Setup nötig — Postgres, Redis und MinIO laufen vollständig als Container,
es muss nichts lokal installiert werden außer Docker.

## Docker Compose: Schnellstart (vorgebaute Images)

Lädt die veröffentlichten `app`/`db-init`-Images aus der GHCR statt lokal zu bauen — der
schnellste Weg zu einer laufenden Instanz:

```bash
# 1. Repo klonen und ins Projektverzeichnis wechseln
git clone <repo-url> studyroom
cd studyroom

# 2. Umgebungsvariablen-Datei aus der Vorlage anlegen
cp .env.example .env.local

# 3. Alle Services starten (lädt Images von ghcr.io/snenjih/studyroom)
docker compose up
```

Die App ist danach unter **http://localhost:3000** erreichbar, die MinIO-Web-UI
(Datei-Storage) unter **http://localhost:9001**.

Eine bestimmte Release-Version statt `latest` pinnen (Image-Tags lassen das `v`-Präfix
der Git-Tags weg):

```bash
IMAGE_TAG=1.2.3 docker compose up
```

Alles im Hintergrund starten:

```bash
docker compose up -d
```

## Docker Compose: Setup mit lokalem Build

Wenn Anwendungscode geändert wurde und nicht das vorgebaute Image, sondern der lokale
Stand verwendet werden soll:

```bash
cp .env.example .env.local
docker compose up --build
```

Das baut `app` und `db-init` lokal aus dem `Dockerfile` (Targets `runner` bzw.
`migrator`) statt sie aus der Registry zu ziehen.

## Entwicklung mit Hot-Reload

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Das overlay (`docker-compose.dev.yml`):

- mountet das Projektverzeichnis in den Container und startet `npm run dev` statt des
  produktiven Servers,
- exponiert zusätzlich Postgres (`5432`) und Redis (`6379`) lokal, damit sie mit
  Datenbank-Clients direkt erreichbar sind,
- übernimmt `node_modules`/`.next` als eigene Volumes, damit lokale Installationen den
  Container nicht überschreiben.

Änderungen an Dateien unter `src/` werden dadurch ohne Neustart des Containers übernommen.

## Umgebungsvariablen (`.env.local`)

`.env.example` ist die vollständige Vorlage und wird eingecheckt; `.env.local` selbst ist
`.gitignore`t und muss lokal aus der Vorlage erzeugt werden (`cp .env.example .env.local`).
Für lokale Entwicklung/Selbsthosting reichen die Vorgabewerte — für einen produktiven
Betrieb müssen mindestens die als "change-me" markierten Werte angepasst werden:

| Variable                                              | Zweck                                                    | Muss vor Produktivbetrieb geändert werden?      |
| ----------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| `DATABASE_URL`                                        | Postgres-Verbindung (muss zu `POSTGRES_*` unten passen)  | Nein, wenn Defaults übernommen werden           |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Zugangsdaten des Postgres-Containers                     | **Ja**                                          |
| `REDIS_URL`                                           | Redis-Verbindung (Sessions/Cache/Job-Queue)              | Nein                                            |
| `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`             | Zugangsdaten des MinIO-Containers                        | **Ja**                                          |
| `MINIO_ENDPOINT`                                      | Interne URL, unter der die App MinIO erreicht            | Nein                                            |
| `MINIO_BUCKET`                                        | Bucket-Name für Datei-Uploads                            | Nein                                            |
| `SESSION_SECRET`                                      | Signierschlüssel für Login-Sessions                      | **Ja** — erzeugen mit `openssl rand -base64 32` |
| `ORG_NAME` / `ORG_SLUG`                               | Name/Slug der beim Seed angelegten Standard-Organisation | Optional                                        |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD`                      | Zugangsdaten des initial angelegten Admin-Accounts       | **Ja**                                          |

Zusätzlich optional beim `docker compose`-Aufruf setzbar (kein Eintrag in `.env.local`
nötig): `GHCR_OWNER` (Registry-Owner der Images, Default `snenjih`) und `IMAGE_TAG`
(Default `latest`).

## Stack

| Service    | Image                                | Zweck                                            |
| ---------- | ------------------------------------ | ------------------------------------------------ |
| `app`      | `ghcr.io/snenjih/studyroom`          | Next.js-Anwendung                                |
| `db-init`  | `ghcr.io/snenjih/studyroom-migrator` | Führt Migrationen + Seed einmalig beim Start aus |
| `postgres` | `postgres:16-alpine`                 | Primäre Datenbank                                |
| `redis`    | `redis:7-alpine`                     | Sessions / Cache / Job-Queue                     |
| `minio`    | `minio/minio:latest`                 | S3-kompatibler Datei-Storage                     |

`db-init` läuft mit `restart: on-failure` und terminiert nach erfolgreichem Lauf; `app`
startet erst, wenn `db-init` erfolgreich durchgelaufen ist und Postgres/Redis "healthy"
sind (siehe `depends_on`-Bedingungen in `docker-compose.yml`).

## Nützliche Befehle im laufenden Stack

```bash
# Logs eines einzelnen Service verfolgen
docker compose logs -f app

# Status aller Services prüfen
docker compose ps

# In die Postgres-Datenbank verbinden (nutzt die Werte aus .env.local)
docker compose exec postgres psql -U studyroom -d studyroom

# Migrationen manuell erneut anstoßen (z.B. nach Schema-Änderungen)
docker compose run --rm db-init

# Einzelnen Service neu bauen und neu starten
docker compose up --build -d app
```

## Stoppen & Aufräumen

```bash
# Container stoppen, Datenvolumes behalten
docker compose down

# Container stoppen und alle Datenvolumes (Postgres, Redis, MinIO) löschen
docker compose down -v
```

## Releases

Ein Push eines Tags im Format `v*.*.*` löst den [Release-Workflow](.github/workflows/release.yml) aus:

1. Baut und pusht die `app`- und `db-init`-(Migrator-)Images nach [GHCR](https://github.com/Snenjih/Studyroom/pkgs/container/studyroom),
   getaggt mit der exakten Version (`1.2.3`, ohne `v`-Präfix), der Minor-Linie (`1.2`),
   der Major-Linie (`1`) und `latest`.
2. Erstellt ein [GitHub Release](https://github.com/Snenjih/Studyroom/releases) für den
   Tag mit automatisch generiertem Changelog seit dem letzten Release.

Release schneiden:

```bash
# aktualisiert package.json/package-lock.json, zeigt danach die nächsten Schritte an
./scripts/bump-version.sh <neue-version>

git add package.json package-lock.json
git commit -m "chore: bump version to <neue-version>"
git tag v<neue-version>
git push origin main --tags
```

Alternativ erledigt `./scripts/bump-version.sh <neue-version> -y` Commit, Tag und Push in
einem Schritt.

## Entwicklungs-Workflow (Claude Code)

Alle Arbeitsschritte sind als granulare Tasks in `tasks/<phase>/T0xx-*.md` abgelegt,
Gesamtübersicht in [`tasks/progress.md`](tasks/progress.md). Jede Session:

```
/next-task
```

Das bearbeitet bewusst nur die nächste offene Task und wartet danach auf Rückmeldung —
kein automatisches Durchrattern der ganzen Liste. Details zum Ablauf stehen in
[`.claude/commands/next-task.md`](.claude/commands/next-task.md) und in
[`CLAUDE.md`](CLAUDE.md).
