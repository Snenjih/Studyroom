# T060: Performance-Tuning (JSONB-Indizes, Query-Optimierungen)

**Phase:** 07-self-hosting-reife
**Status:** offen
**Abhängig von:** T059

## Kontext
Konzept Abschnitt 4: "Postgres kann JSONB indizieren (GIN-Index) — Volltextsuche über
Kursinhalte, Filtern nach Feldern im JSON etc. funktionieren gut genug für die Größenordnung."

## Ziel
Kritische Datenbank-Queries sind optimiert und getestet. GIN-Indizes auf JSONB-Spalten
sind vorhanden. Connection-Pooling ist konfiguriert.

## Schritte
- [ ] GIN-Indizes auf alle `content JSONB`-Spalten (bereits in T010, hier nochmal prüfen)
- [ ] `EXPLAIN ANALYZE` für die 5 häufigsten Queries ausführen und auswerten
- [ ] N+1-Query-Audit: alle `getX()`-Funktionen in `src/lib/db/` auf N+1 prüfen
- [ ] Connection-Pooling konfigurieren (PgBouncer im Docker-Stack oder Drizzle-Pool-Config)
- [ ] `max_connections` Postgres korrekt dimensionieren (ENV-Variable)
- [ ] Slow-Query-Log in Dev-Modus aktivieren (queries > 100ms loggen)

## Abnahmekriterien
- [ ] `EXPLAIN ANALYZE` auf Course-mit-Blöcken-Query zeigt Index-Scan statt Seq-Scan
- [ ] Keine N+1-Queries in den identifizierten Hot-Paths (Dashboard, Kurs-Lernseite)
- [ ] Connection-Pooling-Config ist dokumentiert (wie viele Connections, warum)
- [ ] Slow-Query-Log in Dev aktiv (kann in Prod per ENV deaktiviert werden)

## Betroffene Dateien
- `docker-compose.yml` (pgBouncer optional)
- `src/lib/db/` (Query-Optimierungen)
- `drizzle.config.ts` (Pool-Config)

## Notizen
