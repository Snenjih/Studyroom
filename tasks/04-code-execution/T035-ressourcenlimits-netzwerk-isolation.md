# T035: Ressourcenlimits und Netzwerk-Isolation konfigurieren

**Phase:** 04-code-execution
**Status:** offen
**Abhängig von:** T034

## Kontext
Konzept Abschnitt 6: "Ressourcenlimits (CPU/Memory/Timeout) und Netzwerk-Isolation
(kein Internetzugriff aus der Sandbox) von Anfang an hart konfigurieren."

## Ziel
Code der in Piston ausgeführt wird kann nicht auf das Internet zugreifen und ist durch
CPU/Memory-Limits zeitlich und ressourcenmäßig begrenzt.

## Schritte
- [ ] Docker-Compose: Piston-Netzwerk-Segment isolieren (`networks:` ohne externe Route)
- [ ] Piston-Konfiguration: `max_process_count`, `max_open_files`, `max_file_size` setzen
- [ ] Execution-Request: immer `timeout` setzen (konfigurierbar per ENV: `MAX_EXECUTION_TIMEOUT_MS`)
- [ ] Rate-Limiting auf `/api/execution` Route (max. X Requests/Minute pro User)
- [ ] `src/lib/execution/sandbox.ts` — Konfigurationswerte aus ENV lesen, keine Hardcodes
- [ ] Test: Python-Code der `urllib.request.urlopen` aufruft → Fehler/Timeout erwartet

## Abnahmekriterien
- [ ] Code mit `while True: pass` wird nach Timeout-Sekunden abgebrochen
- [ ] Code der versucht Netzwerkzugriff → Verbindungsfehler (kein Erfolg)
- [ ] Rate-Limit greift bei zu vielen Requests (429)
- [ ] Limits sind per ENV konfigurierbar (nicht hartcodiert)

## Betroffene Dateien
- `docker-compose.yml`
- `src/lib/execution/sandbox.ts`
- `src/app/api/execution/route.ts`

## Notizen
