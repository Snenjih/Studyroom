# T033: Piston-Service im Docker-Compose-Stack ergänzen

**Phase:** 04-code-execution
**Status:** offen
**Abhängig von:** T032

## Kontext
Konzept Abschnitt 6: "Start mit Piston self-hosted als eigener Container im
Docker-Compose-Stack." Ressourcenlimits und Netzwerk-Isolation von Anfang an.

## Ziel
Piston läuft als eigener Container im Docker-Compose-Stack. Er ist nur über das interne
Docker-Netzwerk erreichbar (kein öffentlicher Port). Sprachen sind vorinstalliert.

## Schritte
- [ ] Piston-Service in `docker-compose.yml` ergänzen (Image: `ghcr.io/engineer-man/piston`)
- [ ] Piston-Volume für installierten Runtime-Cache
- [ ] Netzwerk-Konfiguration: Piston nur über internes Docker-Netzwerk erreichbar
      (kein `ports`-Mapping nach außen)
- [ ] `docker-compose.yml` Ressourcenlimits: `cpus: '0.5'`, `memory: 512m` für Piston
- [ ] Init-Skript/Service: installiert die benötigten Sprachen nach Start
      (mindestens: Python, JavaScript/Node, Java)
- [ ] `.env.example` ergänzen: `PISTON_URL=http://piston:2000`

## Abnahmekriterien
- [ ] `docker compose up` startet Piston ohne Fehler
- [ ] Piston antwortet auf `GET /api/v2/runtimes` (interne Anfrage aus App-Container)
- [ ] Piston ist NICHT direkt von außen erreichbar (kein öffentlicher Port)
- [ ] Python/Node/Java-Runtimes sind nach Start verfügbar

## Betroffene Dateien
- `docker-compose.yml`
- `.env.example`

## Notizen
