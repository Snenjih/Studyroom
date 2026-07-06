---
description: Bearbeite die nächste offene Task aus tasks/progress.md (oder eine konkrete Task-ID via Argument)
---

Arbeite streng nach `CLAUDE.md` und `docs/CONCEPT.md` in diesem Projekt.

1. Lies `docs/CONCEPT.md` vollständig, falls das in dieser Session noch nicht geschehen ist.
2. Öffne `tasks/progress.md`.
   - Falls dort außer der Bootstrap-Task noch nichts existiert (Phasen 1-7 sind leer/als
     "wird von T000 befüllt" markiert): bearbeite zuerst
     `tasks/00-bootstrap/T000-generate-task-breakdown.md`. Das ist dann diese Task.
   - Sonst: finde die nächste Task mit Status "offen", niedrigste Nummer zuerst.
   - Falls `$ARGUMENTS` eine konkrete Task-ID enthält (z.B. "T014"), bearbeite genau diese
     Task statt automatisch die nächste offene zu suchen.
3. Lies die vollständige Task-Datei: Kontext, Ziel, Schritte, Abnahmekriterien, betroffene
   Dateien.
4. Prüfe das Feld "Abhängig von". Falls eine dieser Tasks noch nicht den Status "erledigt"
   hat: STOPP. Melde dem Nutzer, welche Abhängigkeit fehlt, und mach nichts weiter.
5. Setze den Status der Task-Datei auf "in Arbeit".
6. Implementiere die Task in kleinen, nachvollziehbaren Schritten. Halte dich an den
   festgelegten Tech-Stack aus `CLAUDE.md`. Bei Unsicherheiten, die die Architektur aus
   `docs/CONCEPT.md` betreffen: dort nachlesen statt zu raten.
7. Prüfe jedes Abnahmekriterium der Task explizit. Führe vorhandene Tests/Linting/Build
   aus, falls im Projekt bereits Skripte dafür existieren.
8. Setze den Status der Task-Datei auf "erledigt" (mit Datum), hake die entsprechende
   Checkbox in `tasks/progress.md` ab.
9. Committe die Änderungen mit einer Commit-Message im Format `T0xx: Kurzbeschreibung`.
10. Fasse für den Nutzer in 3-5 Sätzen zusammen, was gemacht wurde und was das Ergebnis ist.
    STOPPE danach. Bearbeite NICHT automatisch die nächste Task, auch wenn `tasks/progress.md`
    weitere offene Tasks enthält — das entscheidet der Nutzer in der nächsten Nachricht/Session.

Sonderfall T000 (Task-Breakdown generieren): Diese Task erzeugt ausschließlich weitere
Task-Dateien und aktualisiert `tasks/progress.md` — sie darf keinen Anwendungscode schreiben
und kein `npm install`/Projekt-Setup durchführen. Das ist Aufgabe von T001 und folgenden.
