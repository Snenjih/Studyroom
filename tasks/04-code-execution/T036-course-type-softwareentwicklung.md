# T036: Course-Type "Softwareentwicklung" — Block-Schema + Execution-Anbindung

**Phase:** 04-code-execution
**Status:** offen
**Abhängig von:** T035

## Kontext
Konzept Abschnitt 3 & 10 (Phase 3): "Course-Type 'Softwareentwicklung' mit
Testfall-Feedback." Nutzt das Code-Execution-Modul als Custom-Engine-Modul.

## Ziel
Ein neuer Course-Type "Softwareentwicklung" existiert, der Code-Aufgaben-Blöcke
unterstützt. Learner können Code einreichen und erhalten Testfall-Feedback.

## Schritte
- [ ] `src/modules/course-types/software-dev/index.ts` — `softwareDevModule: AppModule`
      (registriert CourseType `software-dev`, Permission `code:execute`)
- [ ] Block-Schema: `{ task_description, language, starter_code, test_cases: [{input, expected_output}] }`
- [ ] `src/modules/course-types/software-dev/SoftwareDevBlock.tsx` — Renderer: Aufgabenbeschreibung,
      Code-Editor, Submit-Button, Ergebnis-Anzeige
- [ ] `src/modules/course-types/software-dev/SoftwareDevEditor.tsx` — Trainer-Editor:
      Beschreibung, Sprache, Starter-Code, Testfälle definieren
- [ ] `AppModule.hooks.onBlockSubmit` — ruft `executeCode()` auf
- [ ] `src/app-config.ts` um software-dev-Modul ergänzen

## Abnahmekriterien
- [ ] Trainer kann Aufgabe mit Testfällen anlegen
- [ ] Learner kann Code einreichen und sieht Testergebnis (bestanden/fehlgeschlagen)
- [ ] Block-Status: `done` wenn alle Tests bestanden, `failed` wenn mindestens einer fehlschlägt
- [ ] Submission-Data speichert eingereichten Code und Testergebnisse

## Betroffene Dateien
- `src/modules/course-types/software-dev/` (neu)
- `src/app-config.ts`

## Notizen
