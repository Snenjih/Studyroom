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
