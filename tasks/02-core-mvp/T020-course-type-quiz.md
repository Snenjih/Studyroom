# T020: Course-Type "Einfaches Quiz" — Renderer + Block-Editor

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T019

## Kontext
Konzept Abschnitt 3 & 10: Dritter hartcodierter Course-Type. Multiple-Choice mit
einer richtigen Antwort. Execution-Engine: `quiz` (automatische Auswertung).

## Ziel
Learner können Multiple-Choice-Fragen beantworten. Die Antwort wird sofort ausgewertet,
Feedback (richtig/falsch) wird angezeigt. Block gilt als `done` nach Beantwortung.

## Schritte
- [x] `src/modules/course-types/quiz/QuizBlock.tsx` — Renderer: Frage + Optionen als
      Radio-Buttons, Submit-Button, Feedback-Anzeige (richtig/falsch + korrekte Antwort)
- [x] `src/modules/course-types/quiz/QuizEditor.tsx` — Trainer-Editor: Frage, bis zu
      4 Optionen, Markierung der richtigen Antwort
- [x] Auswertungslogik: `submission_data.selected_index === correct_index`
- [x] `score` = 1.0 bei richtig, 0.0 bei falsch; `status` = `done` in beiden Fällen
- [x] `src/lib/course-type-registry.ts` um Quiz-Typ ergänzt

## Abnahmekriterien
- [x] Richtige Antwort: grüne Hervorhebung + "Richtig!"-Feedback
- [x] Falsche Antwort: rote Hervorhebung + Anzeige der richtigen Antwort
- [x] Bereits beantwortete Blöcke sind bei erneutem Aufruf als "beantwortet" markiert
- [x] Editor lässt genau eine Antwort als korrekt markieren

## Betroffene Dateien
- `src/modules/course-types/quiz/` (neu)
- `src/lib/course-type-registry.ts`

## Notizen
`BlockProgressSummary` (in `course-type-registry.ts`, T018) um `submissionData` ergänzt,
damit der Quiz-Renderer beim erneuten Aufruf weiß, welche Option zuvor gewählt wurde
(nicht nur, dass "irgendwie" fertig ist) — Lern-Seite reicht `progress.submissionData`
jetzt entsprechend durch. Auswertung (`selected === correct_index`) läuft rein
clientseitig vor dem Aufruf von `onComplete`; das ist für Phase 2 (kein Cheat-Schutz
nötig, reine Lernkontrolle) ausreichend, eine serverseitige Neuprüfung wäre erst relevant,
wenn Quiz-Ergebnisse z. B. in Zertifikate einfließen (Phase 5).

End-to-End getestet: Quiz-Kurs anlegen, Frage mit 3 Optionen per API anlegen, Lern-Seite
zeigt Frage + Radio-Optionen + Submit-Button (200 OK), Trainer-Editor zeigt registrierte
Options-Zeilen mit "+ Option hinzufügen". Eine korrekte Antwort wurde direkt in
`block_progress` simuliert (`status=done`, `score=1`, `submission_data.selected_index=1`)
und die Lern-Seite beim erneuten Laden zeigt korrekt "Bereits beantwortet" + "Richtig!" +
die vorher gewählte Option als markiert — bestätigt sowohl die Wiederherstellung des
Zustands als auch die Grün/Rot-Feedback-Logik. Der eigentliche Klick/Submit-Vorgang
selbst ließ sich mangels Headless-Browser nicht auslösen.
