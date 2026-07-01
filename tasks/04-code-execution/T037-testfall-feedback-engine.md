# T037: Testfall-Feedback-Engine

**Phase:** 04-code-execution
**Status:** offen
**Abhängig von:** T036

## Kontext
Konzept Abschnitt 6: "Module sind frei darin, wie sie das Ergebnis interpretieren
(Unit-Test-Zähler, Ausgabe-Vergleich, Linting-Score, …)." Erste Implementierung:
Ausgabe-Vergleich gegen erwartete Ausgabe.

## Ziel
Die Testfall-Engine vergleicht tatsächliche Ausgabe mit erwarteter Ausgabe und gibt
strukturiertes Feedback zurück (welche Tests bestanden, welche fehlgeschlagen).

## Schritte
- [ ] `src/modules/course-types/software-dev/test-runner.ts` — `runTests(code, testCases)`:
      führt Code für jeden Testfall aus, vergleicht stdout mit expected_output
- [ ] `TestResult` Type: `{ testCase, passed, actualOutput, expectedOutput, error? }`
- [ ] Whitespace-toleranter Vergleich (trim von stdout und expected)
- [ ] Score-Berechnung: `passed / total * 100`
- [ ] Fehler-Anzeige-Komponente: `src/modules/course-types/software-dev/TestResults.tsx`
      (grüne/rote Zeilen pro Testfall)

## Abnahmekriterien
- [ ] Alle Testfälle werden einzeln ausgeführt und bewertet
- [ ] Whitespace am Zeilenanfang/-ende wird beim Vergleich ignoriert
- [ ] Learner sieht pro Testfall: ✓ bestanden / ✗ fehlgeschlagen + tatsächliche Ausgabe
- [ ] Score in `block_progress.score` gespeichert (0.0–1.0)

## Betroffene Dateien
- `src/modules/course-types/software-dev/test-runner.ts` (neu)
- `src/modules/course-types/software-dev/TestResults.tsx` (neu)

## Notizen
