# T057: Health-Check-Endpunkte

**Phase:** 07-self-hosting-reife
**Status:** offen
**Abhängig von:** T056

## Kontext
Konzept Abschnitt 10 (Phase 6): Self-Hosting-Reife. Health-Checks sind Voraussetzung
für vernünftige Docker-Compose-Konfiguration und externe Monitoring-Tools.

## Ziel
`GET /api/health` gibt den Status aller kritischen Services zurück (DB, Redis, MinIO).
Docker-Compose nutzt Health-Checks für Service-Abhängigkeiten.

## Schritte
- [ ] `src/app/api/health/route.ts` — prüft: DB-Verbindung (simples SELECT 1),
      Redis-Verbindung (PING), MinIO-Verbindung (Bucket-List)
- [ ] Response-Format: `{ status: 'ok'|'degraded'|'down', services: { db, redis, minio } }`
- [ ] Einzelner Service ausgefallen → HTTP 503 (statt 200 mit Fehler-Body)
- [ ] `docker-compose.yml`: `healthcheck` für App-Service (nutzt `/api/health`)
- [ ] `depends_on` mit `condition: service_healthy` für App → Postgres

## Abnahmekriterien
- [ ] `GET /api/health` gibt 200 wenn alle Services erreichbar
- [ ] `GET /api/health` gibt 503 wenn Postgres nicht erreichbar
- [ ] Docker-Compose `docker ps` zeigt `(healthy)` für App nach Start
- [ ] Health-Endpoint braucht kein Auth (öffentlich zugänglich)

## Betroffene Dateien
- `src/app/api/health/route.ts` (neu)
- `docker-compose.yml`

## Notizen
