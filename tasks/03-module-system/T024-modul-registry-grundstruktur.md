# T024: Modul-Registry Grundstruktur (AppConfig-Pattern)

**Phase:** 03-module-system
**Status:** erledigt (2026-07-08)
**Abhängig von:** T023

## Kontext
Konzept Abschnitt 2: Payload-Plugin-Pattern — Modul exportiert `register(config): config`.
"Core bleibt schlank, jedes Feature ist im Prinzip selbst ein Modul."

## Ziel
Die TypeScript-Typen für `AppConfig` und `AppModule` existieren. Eine `ModuleRegistry`
kann Module registrieren und die resultierende Gesamt-Konfiguration auflösen.

## Schritte
- [x] `src/lib/module-system/types.ts` — `AppConfig`, `AppModule` Interfaces nach Konzept
      Abschnitt 2 (courseTypes, permissions, settingsPanels, hooks)
- [x] `src/lib/module-system/registry.ts` — `ModuleRegistry`-Klasse:
      `register(module)`, `getConfig()` (Module nacheinander anwenden)
- [x] `src/lib/module-system/index.ts` — Singleton-Registry-Instanz
- [x] `src/app-config.ts` — Root-Konfiguration (Core-Defaults + Modul-Registration)
- [x] Unit-Tests für Registry: Module werden korrekt angewendet, Config akkumuliert

## Abnahmekriterien
- [x] `ModuleRegistry.register(module)` ruft `module.register(config)` auf
- [x] Mehrere Module können registriert werden, Config wird akkumuliert
- [x] `AppConfig` enthält: `courseTypes[]`, `permissions[]`, `settingsPanels[]`, `hooks`
- [x] TypeScript-Compile ohne Fehler

## Betroffene Dateien
- `src/lib/module-system/types.ts`, `registry.ts`, `index.ts` (neu)
- `src/app-config.ts` (neu)

## Notizen
- `BlockRendererProps`/`BlockEditorProps`/`BlockProgressStatus` etc. wurden von
  `src/lib/course-type-registry.ts` (T018) hierher als kanonische Definition verschoben,
  da dieses Modul in T025 durch das neue Modul-System ersetzt wird.
- `CourseTypeModuleDefinition.schemaDefinition` nutzt vorerst das bestehende
  `CourseTypeSchemaDefinition`-Format aus `db/schema/course-types.ts` — T026 formalisiert
  das Format erst als eigenen Schritt, ohne diese Struktur hier zu brechen.
- Kein neues Test-Framework eingeführt: Unit-Tests laufen über Node's eingebauten
  Test-Runner (`node --test`, Node 22) mit `tsx` als Loader (bereits Dev-Dependency) für
  TS/Pfad-Alias-Unterstützung — kein zusätzliches Paket wie vitest/jest nötig. Neues
  npm-Script: `npm test`.
