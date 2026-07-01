# Wie das Task-System funktioniert

- **`progress.md`** — Gesamtübersicht, immer der schnellste Blick auf "wo stehen wir".
- **`TASK_TEMPLATE.md`** — Struktur, der jede Task-Datei folgt.
- **`00-bootstrap/T000-...`** — Die einzige von Hand geschriebene Task. Sie lässt Claude
  Code selbst den kompletten restlichen Task-Breakdown erzeugen.
- **`01-foundation/` bis `07-self-hosting-reife/`** — Werden von T000 befüllt, orientiert
  an den Phasen aus `docs/CONCEPT.md`, Abschnitt 10.

## Tägliche Nutzung
In einer neuen Claude-Code-Session im Projektordner:

```
/next-task
```

Das war's. Claude Code liest automatisch `CLAUDE.md` + `docs/CONCEPT.md`, sucht die
nächste offene Task in `progress.md`, setzt sie um, aktualisiert Status/Commit — und
stoppt danach. Für eine bestimmte Task statt der nächsten offenen:

```
/next-task T014
```

## Wenn sich am Konzept etwas ändert
`docs/CONCEPT.md` ist die Quelle der Wahrheit. Änderungen dort direkt einpflegen (mit mir
im Chat oder selbst) — offene Task-Dateien, die davon betroffen sind, im Zweifel kurz
manuell nachziehen, bevor `/next-task` sie umsetzt.
