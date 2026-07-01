# T025: Bestehende Course-Types als Module umbauen

**Phase:** 03-module-system
**Status:** offen
**Abhängig von:** T024

## Kontext
Konzept Abschnitt 10 (Phase 2): "Die Phase-1-Typen werden zu Modulen umgebaut —
guter Realitätscheck der Architektur." Beweist, dass das Plugin-Pattern wirklich
funktioniert, bevor neue Typen nach diesem Muster gebaut werden.

## Ziel
Die drei hartcodierten Course-Types (Markdown-Info, Flashcards, Quiz) sind als
vollwertige AppModule strukturiert und werden über die ModuleRegistry registriert.

## Schritte
- [ ] `src/modules/course-types/markdown-info/index.ts` — `markdownInfoModule: AppModule`
- [ ] `src/modules/course-types/flashcards/index.ts` — `flashcardsModule: AppModule`
- [ ] `src/modules/course-types/quiz/index.ts` — `quizModule: AppModule`
- [ ] Jedes Modul registriert seinen CourseType in `config.courseTypes`
- [ ] `src/app-config.ts` registriert alle drei Module über die Registry
- [ ] `src/lib/course-type-registry.ts` aus T018 durch das neue System ersetzen
- [ ] Existierende Renderer/Editoren bleiben erhalten, nur die Registrierung ändert sich

## Abnahmekriterien
- [ ] Die App funktioniert identisch wie vor dem Umbau (kein Feature-Verlust)
- [ ] `getConfig().courseTypes` enthält alle drei Typen nach Registrierung
- [ ] Die alten statischen Imports des course-type-registry sind entfernt
- [ ] Kein TypeScript-Fehler

## Betroffene Dateien
- `src/modules/course-types/*/index.ts` (neu pro Modul)
- `src/app-config.ts`, `src/lib/course-type-registry.ts` (geändert/gelöscht)

## Notizen
