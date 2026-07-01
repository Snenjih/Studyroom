# T055: Update-Mechanismus zwischen Versionen

**Phase:** 07-self-hosting-reife
**Status:** offen
**Abhängig von:** T054

## Kontext
Konzept Abschnitt 10 (Phase 6): "Update-Mechanismus zwischen Versionen." Self-Hoster
müssen auf neue Versionen updaten können, ohne Daten zu verlieren.

## Ziel
Der Update-Prozess ist dokumentiert und automatisiert: `docker compose pull && docker compose up`
führt Migrations automatisch aus. Rollback-Strategie existiert.

## Schritte
- [ ] `docker-compose.yml`: App-Start führt automatisch `npm run db:migrate` aus
      (vor dem eigentlichen Start, als Entrypoint-Schritt)
- [ ] `scripts/update.sh` — zieht neues Image, stoppt App, führt Migrate aus, startet App
- [ ] `CHANGELOG.md` Struktur definieren (Semantic Versioning, Breaking Changes markieren)
- [ ] Versions-Tabelle in DB: `schema_version` speichert angewendete Migrations-IDs
      (Drizzle macht das automatisch — prüfen ob vorhanden)
- [ ] README: Update-Anleitung ("Wie update ich von v1.x auf v2.x?")

## Abnahmekriterien
- [ ] Nach `docker compose pull && docker compose up` laufen neue Migrations automatisch
- [ ] Bestehende Daten bleiben nach Update erhalten
- [ ] `scripts/update.sh` dokumentiert was es tut (kein silent fail)
- [ ] `CHANGELOG.md` ist vorhanden mit erstem Eintrag

## Betroffene Dateien
- `scripts/update.sh` (neu)
- `docker-compose.yml` (Entrypoint anpassen)
- `CHANGELOG.md` (neu)

## Notizen
