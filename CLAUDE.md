# Projekt: Modulare Learning-Plattform

## Was das ist

Selbstgehostete, Docker-basierte Lernplattform (vergleichbar ClassroomIO), aber mit
vollständig frei definierbaren Course-Typen als wiederverwendbare Templates.

**Vollständiges Konzept: `docs/CONCEPT.md`.** Bei Bearbeitung irgendeiner Task in diesem
Projekt IMMER zuerst `docs/CONCEPT.md` lesen, falls das in der aktuellen Session noch nicht
geschehen ist. Das Dokument ist die Quelle der Wahrheit für Architektur-Entscheidungen —
bei Widersprüchen zwischen einer Task-Beschreibung und dem Konzept gilt das Konzept.

## Architektur-Kurzfassung (Details siehe docs/CONCEPT.md)

- Core + Module-Pattern (Plugin-Config-Modell, siehe Konzept Abschnitt 2)
- Domänenmodell: Organization → Program → Course → CourseType (Schema-Template) → ContentBlock
- Eine Datenbank: Postgres, relationale Kern-Tabellen + JSONB für variable Course-Inhalte
  (Konzept Abschnitt 4) — KEINE zweite Datenbank (kein Mongo o.ä.) einführen
- Single-Tenant pro Instanz, aber `org_id`-Spalten überall vorhanden (Konzept Abschnitt 5)
- Code-Ausführung läuft über einen zentralen Sandbox-Service (Piston); Module rufen diesen
  Service auf, implementieren niemals eigenes Sandboxing (Konzept Abschnitt 6)

## Tech-Stack (festgelegt, nicht ohne Rücksprache mit dem Nutzer ändern)

- Next.js + TypeScript
- Postgres + Drizzle ORM
- Docker Compose für Self-Hosting (App, Postgres, Redis, MinIO, Sandbox-Service)

@AGENTS.md

## Arbeitsweise in diesem Projekt

- Alle Arbeitsschritte sind als granulare Tasks in `tasks/<phase>/T0xx-*.md` abgelegt,
  Gesamtübersicht in `tasks/progress.md`.
- Um die nächste offene Task zu bearbeiten: Slash-Command `/next-task` verwenden.
  Die Ablauflogik dafür steht in `.claude/commands/next-task.md`.
- Jede Task-Datei folgt `tasks/TASK_TEMPLATE.md`.
- Nach Abschluss einer Task: Status in der Task-Datei und in `tasks/progress.md` aktualisieren,
  git commit mit der Task-ID im Titel (Format: `T0xx: Kurzbeschreibung`).
- Nach einer erledigten Task NICHT automatisch mit der nächsten weitermachen — kurz
  zusammenfassen und auf Rückmeldung warten, auch wenn noch offene Tasks existieren.
- Wenn eine Task Abhängigkeiten zu noch offenen Tasks hat: stoppen und das dem Nutzer melden,
  statt die Reihenfolge selbst zu ändern.

## Lokale Dev-Umgebung & Browser-Testing

Diese Dev-Umgebung läuft selbst bereits in einem Docker-Container (VPS ohne grafische
Oberfläche) — **verschachteltes Docker funktioniert hier nicht** (`docker ps` schlägt mit
Permission-Fehler fehl, auch mit `dangerouslyDisableSandbox`). `docker-compose.dev.yml` ist
also für diese Umgebung nicht nutzbar.

**App stattdessen immer nativ starten:** `npm run dev` (Next.js/Turbopack, in <1s bereit).
Läuft völlig unabhängig von Docker.

**Datenbank:** Auf diesem Host läuft bereits ein natives Postgres auf `127.0.0.1:5432` mit
fertig migrierter `studyroom`-DB (Rolle `studyroom`, Passwort `studyroom`) inkl. Seed-Daten
(Admin-User `admin@studyroom.local` / `change-me-in-production`). `.env.local` (gitignored)
ist entsprechend auf `DATABASE_URL=postgresql://studyroom:studyroom@127.0.0.1:5432/studyroom`
gesetzt (Docker-Compose-Standard wäre Hostname `postgres`, der hier nicht auflöst). Redis wird
im Code aktuell nirgends genutzt (kein Blocker), MinIO nur lazy in `src/lib/storage.ts` für
Org-Logo-Upload — beides für Login/Dashboard/Courses ohne Belang.

**Server selbst starten + Ergebnis ansehen (kein GUI nötig):**
- Permissions für `npm run dev/build/start` und `curl` gegen localhost liegen bereits in
  `.claude/settings.json` — kein Nachfragen nötig.
- Playwright ist als Dev-Dependency installiert (`npm install -D playwright`, Chromium via
  `npx playwright install --with-deps chromium` bereits vorhanden) — für Screenshots/eigene
  Test-Skripte per Node direkt nutzbar.
- Zusätzlich ist ein Playwright-**MCP-Server** eingerichtet (lokaler Scope, nur auf diesem
  Rechner/Projekt, nicht in git): `claude mcp add playwright --scope local -- npx
  @playwright/mcp@latest --headless --isolated --browser chromium`. Damit stehen
  `mcp__playwright__browser_*`-Tools (navigate, click, type, snapshot, screenshot, ...) für
  interaktives Testen zur Verfügung — u.a. damit schon erfolgreich Login → Program → Course →
  Content-Block → Lerner-Ansicht end-to-end durchgespielt.
  - Falls der MCP-Server neu eingerichtet werden muss: Browser-Channel **muss** `chromium`
    sein (nicht der Default `chrome`, der System-Chrome sucht und fehlschlägt) — zusätzlich
    einmalig `npx @playwright/mcp install-browser chrome-for-testing` ausführen (eigene,
    von der `playwright`-Library getrennte Browser-Verwaltung).
  - Nach `claude mcp add`/Config-Änderungen sind die Tools erst nach einem Session-Neustart
    verfügbar (wie bei Hooks) — nicht wundern, wenn sie direkt danach noch fehlen.
- Screenshots/Snapshots aus Test-Skripten immer ins Scratchpad-Verzeichnis schreiben, nicht
  ins Repo-Root. `.playwright-mcp/` (Snapshot/Log-Output des MCP-Servers) ist gitignored.
- Nach jedem Test: Dev-Server-Prozess wieder beenden (`pkill -f "next dev"`), sonst blockiert
  er Port 3000 für die nächste Session.
