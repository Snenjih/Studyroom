# T025: Bestehende Course-Types als Module umbauen

**Phase:** 03-module-system
**Status:** erledigt (2026-07-08)
**Abhängig von:** T024

## Kontext
Konzept Abschnitt 10 (Phase 2): "Die Phase-1-Typen werden zu Modulen umgebaut —
guter Realitätscheck der Architektur." Beweist, dass das Plugin-Pattern wirklich
funktioniert, bevor neue Typen nach diesem Muster gebaut werden.

## Ziel
Die drei hartcodierten Course-Types (Markdown-Info, Flashcards, Quiz) sind als
vollwertige AppModule strukturiert und werden über die ModuleRegistry registriert.

## Schritte
- [x] `src/modules/course-types/markdown-info/index.ts` — `markdownInfoModule: AppModule`
- [x] `src/modules/course-types/flashcards/index.ts` — `flashcardsModule: AppModule`
- [x] `src/modules/course-types/quiz/index.ts` — `quizModule: AppModule`
- [x] Jedes Modul registriert seinen CourseType in `config.courseTypes`
- [x] `src/app-config.ts` registriert alle drei Module über die Registry
- [x] `src/lib/course-type-registry.ts` aus T018 durch das neue System ersetzt
- [x] Existierende Renderer/Editoren bleiben erhalten, nur die Registrierung ändert sich

## Abnahmekriterien
- [x] Die App funktioniert identisch wie vor dem Umbau (kein Feature-Verlust)
- [x] `getConfig().courseTypes` enthält alle drei Typen nach Registrierung
- [x] Die alten statischen Imports des course-type-registry sind entfernt
- [x] Kein TypeScript-Fehler

## Betroffene Dateien
- `src/modules/course-types/*/index.ts` (neu pro Modul)
- `src/app-config.ts`, `src/lib/course-type-registry.ts` (geändert/gelöscht)

## Notizen
- Jedes Modul liest `key`/`name`/`executionEngine`/`schemaDefinition` aus
  `BASE_COURSE_TYPES` (`src/db/seed-data/course-types.ts`) statt sie zu duplizieren —
  bleibt Single Source of Truth für Seed-Skript und Modul-Registrierung. T026
  formalisiert das `schemaDefinition`-Format als eigenen Schritt.
- `ModuleRegistry.register()` wurde idempotent nach `module.key` gemacht (No-Op bei
  bereits registriertem Key) — Schutz gegen doppelte Registrierung, falls
  `src/app-config.ts` durch Next.js-Modul-Neuausführung (Dev-Server/Fast-Refresh)
  mehrfach evaluiert wird.
- `getCourseTypeModule(key)` in `src/app-config.ts` ersetzt den direkten
  Objekt-Zugriff auf das alte `courseTypeRegistry` in `BlockRow.tsx` (Client-
  Komponente) und `courses/[id]/learn/page.tsx` (Server-Komponente) — beide
  Kontexte funktionieren, da `app-config.ts`/`module-system` keine
  `server-only`-Importe transitiv mitziehen (nur Typ-Importe aus `db/schema`).
- TypeScript-Compile, `npm test` (7/7) und `eslint` laufen fehlerfrei durch.
