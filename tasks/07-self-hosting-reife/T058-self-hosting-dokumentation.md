# T058: Self-Hosting-Dokumentation

**Phase:** 07-self-hosting-reife
**Status:** offen
**Abhängig von:** T057

## Kontext
Konzept Abschnitt 10 (Phase 6): "Dokumentation für andere Self-Hoster." Zielgruppe:
technisch versierte Einzelpersonen oder kleine Teams ohne Ops-Erfahrung.

## Ziel
Eine vollständige Setup-Dokumentation ermöglicht es jemand ohne Vorwissen, die App
auf einem eigenen Server zum Laufen zu bringen.

## Schritte
- [ ] `docs/self-hosting.md` — vollständiger Setup-Guide:
      Voraussetzungen (Docker, Docker Compose, Portfreigabe), Clone, ENV konfigurieren,
      `docker compose up`, erster Admin-Login
- [ ] `docs/troubleshooting.md` — häufige Probleme: DB-Verbindungsfehler, Port-Konflikte,
      MinIO nicht erreichbar, Seed fehlgeschlagen
- [ ] `docs/upgrade-guide.md` — Upgrade-Anleitung (Update-Skript, Breaking Changes prüfen)
- [ ] `README.md` überarbeiten: kürzer, klarer, Link auf `docs/self-hosting.md`
- [ ] Reverse-Proxy-Konfigurationsbeispiele: nginx, Caddy (als Referenz, nicht als Pflicht)

## Abnahmekriterien
- [ ] Jemand mit grundlegenden Linux-Kenntnissen kann der Anleitung folgen
- [ ] Alle Befehle sind copy-pasteable (keine Lücken)
- [ ] Troubleshooting deckt die 5 häufigsten Fehlerszenarien ab
- [ ] README gibt innerhalb von 30 Sekunden ein klares Bild was die App macht

## Betroffene Dateien
- `docs/self-hosting.md`, `docs/troubleshooting.md`, `docs/upgrade-guide.md` (neu)
- `README.md`

## Notizen
