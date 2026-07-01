# Modulare Learning-Plattform

Selbstgehostete, Docker-basierte Lernplattform mit vollständig frei definierbaren
Course-Typen als wiederverwendbare Templates. Vollständiges Konzept: [`docs/CONCEPT.md`](docs/CONCEPT.md).

## Setup

1. Diesen Ordner als Git-Repo initialisieren:
   ```bash
   git init
   git add .
   git commit -m "Initial: Projektkonzept + Task-Struktur"
   ```
2. Ordner in Claude Code öffnen (`claude` im Projektverzeichnis starten).
3. Erste Nachricht in der ersten Session:
   ```
   /next-task
   ```
   Das startet mit T000 und lässt Claude Code den kompletten Task-Breakdown aus
   `docs/CONCEPT.md` generieren. Ergebnis kurz gegenprüfen (v.a. `tasks/progress.md`),
   dann in der nächsten Session wieder `/next-task` für die erste echte Implementierungs-Task.

## Projektstruktur

```
CLAUDE.md                    Persistente Instruktionen für Claude Code (kurz gehalten)
.claude/commands/next-task.md   Der /next-task-Workflow
docs/CONCEPT.md              Vollständiges Architektur-Konzept — Quelle der Wahrheit
tasks/                        Granulare, einzeln abarbeitbare Tasks
  progress.md                 Gesamtübersicht / Fortschritt
  TASK_TEMPLATE.md            Struktur jeder Task-Datei
  00-bootstrap/                Generiert den restlichen Task-Breakdown
  01-foundation/ ... 07-self-hosting-reife/   Werden von T000 befüllt
```

## Weiterarbeiten
Jede Session: `/next-task` eingeben, Ergebnis prüfen, bei Bedarf Feedback geben, neue
Session starten, wieder `/next-task`. Claude Code bearbeitet bewusst nur eine Task pro
Aufruf und wartet danach auf Rückmeldung — kein automatisches Durchrattern der ganzen Liste.
