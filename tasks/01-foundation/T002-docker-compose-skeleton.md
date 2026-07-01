# T002: Docker-Compose-Skeleton aufsetzen

**Phase:** 01-foundation
**Status:** offen
**Abhängig von:** T001

## Kontext
Konzept Abschnitt 10 (Phase 0): Docker-Compose-Stack mit App, Postgres, Redis, MinIO und
später Sandbox-Service. Self-Hosting-Anforderung — der gesamte Stack läuft per `docker compose up`.

## Ziel
`docker compose up` startet alle Services (App-Container, Postgres, Redis, MinIO) und die
Next.js-App ist unter `http://localhost:3000` erreichbar.

## Schritte
- [ ] `docker-compose.yml` mit Services anlegen: `app` (Next.js), `postgres`, `redis`, `minio`
- [ ] `Dockerfile` für den Next.js-App-Container (multi-stage build: builder + runner)
- [ ] `.env.example` mit allen benötigten Umgebungsvariablen (DB-URL, Redis-URL, MinIO-Creds)
- [ ] `.env.local` für lokale Entwicklung aus `.env.example` ableiten (in `.gitignore`)
- [ ] Postgres-Volume für Datenpersistenz konfigurieren
- [ ] MinIO-Volume + Bucket-Init-Skript (Startup-Hook)
- [ ] `docker-compose.dev.yml` für Entwicklungsmodus (Hot-Reload, direkter Port-Zugriff auf DB)
- [ ] `README.md` ergänzen: minimale "Getting Started"-Anleitung

## Abnahmekriterien
- [ ] `docker compose up` startet alle 4 Services ohne Fehler
- [ ] Postgres ist über `DATABASE_URL` aus der App erreichbar
- [ ] Redis ist über `REDIS_URL` aus der App erreichbar
- [ ] MinIO-Web-UI ist unter Port 9001 erreichbar
- [ ] `docker compose down -v` entfernt alle Volumes sauber

## Betroffene Dateien
- `docker-compose.yml`, `docker-compose.dev.yml`, `Dockerfile`
- `.env.example`, `.env.local`

## Notizen
