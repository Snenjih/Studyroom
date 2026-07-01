# T054: Backup/Restore-Tooling

**Phase:** 07-self-hosting-reife
**Status:** offen
**Abhängig von:** T053

## Kontext
Konzept Abschnitt 9: "Backup/Restore-Tooling — bei 'jede Instanz unabhängig' trägst
du als Self-Hoster die Verantwortung. Ein sauberes pg_dump/Restore-Skript im
Docker-Stack ist Pflicht, kein Nice-to-have."

## Ziel
Ein Backup-Skript sichert DB + MinIO-Dateien in ein lokales Verzeichnis.
Ein Restore-Skript stellt aus diesem Backup wieder her.

## Schritte
- [ ] `scripts/backup.sh` — `pg_dump` der Postgres-DB in `.sql.gz`-Datei +
      MinIO-Bucket-Export via `mc mirror`
- [ ] `scripts/restore.sh` — `pg_restore` aus `.sql.gz` + MinIO-Bucket-Import
- [ ] Backup-Verzeichnis via Docker-Volume oder Bind-Mount konfigurierbar
- [ ] `docker-compose.yml`: optionaler `backup`-Service der `backup.sh` ausführt
- [ ] `BACKUP_DIR` ENV-Variable für Backup-Pfad
- [ ] Cron-Hinweis in Dokumentation (kein eingebauter Auto-Cron — zu komplex für MVP)

## Abnahmekriterien
- [ ] `./scripts/backup.sh` erstellt `.sql.gz` + MinIO-Archive
- [ ] `./scripts/restore.sh <backup-dir>` stellt die Daten wieder her
- [ ] Restore auf frischer Instanz macht die App funktionsfähig
- [ ] Skripte funktionieren ohne Root-Rechte auf dem Host

## Betroffene Dateien
- `scripts/backup.sh`, `scripts/restore.sh` (neu)
- `docker-compose.yml`

## Notizen
