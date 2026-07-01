# T020: Course-Type "Einfaches Quiz" — Renderer + Block-Editor

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T019

## Kontext
Konzept Abschnitt 3 & 10: Dritter hartcodierter Course-Type. Multiple-Choice mit
einer richtigen Antwort. Execution-Engine: `quiz` (automatische Auswertung).

## Ziel
Learner können Multiple-Choice-Fragen beantworten. Die Antwort wird sofort ausgewertet,
Feedback (richtig/falsch) wird angezeigt. Block gilt als `done` nach Beantwortung.

## Schritte
- [ ] `src/modules/course-types/quiz/QuizBlock.tsx` — Renderer: Frage + Optionen als
      Radio-Buttons, Submit-Button, Feedback-Anzeige (richtig/falsch + korrekte Antwort)
- [ ] `src/modules/course-types/quiz/QuizEditor.tsx` — Trainer-Editor: Frage, bis zu
      4 Optionen, Markierung der richtigen Antwort
- [ ] Auswertungslogik: `submission_data.selected_index === correct_index`
- [ ] `score` = 1.0 bei richtig, 0.0 bei falsch; `status` = `done` in beiden Fällen
- [ ] `src/lib/course-type-registry.ts` um Quiz-Typ ergänzen

## Abnahmekriterien
- [ ] Richtige Antwort: grüne Hervorhebung + "Richtig!"-Feedback
- [ ] Falsche Antwort: rote Hervorhebung + Anzeige der richtigen Antwort
- [ ] Bereits beantwortete Blöcke sind bei erneutem Aufruf als "beantwortet" markiert
- [ ] Editor lässt genau eine Antwort als korrekt markieren

## Betroffene Dateien
- `src/modules/course-types/quiz/` (neu)
- `src/lib/course-type-registry.ts`

## Notizen
