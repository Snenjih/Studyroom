# T024: Modul-Registry Grundstruktur (AppConfig-Pattern)

**Phase:** 03-module-system
**Status:** offen
**Abhängig von:** T023

## Kontext
Konzept Abschnitt 2: Payload-Plugin-Pattern — Modul exportiert `register(config): config`.
"Core bleibt schlank, jedes Feature ist im Prinzip selbst ein Modul."

## Ziel
Die TypeScript-Typen für `AppConfig` und `AppModule` existieren. Eine `ModuleRegistry`
kann Module registrieren und die resultierende Gesamt-Konfiguration auflösen.

## Schritte
- [ ] `src/lib/module-system/types.ts` — `AppConfig`, `AppModule` Interfaces nach Konzept
      Abschnitt 2 (courseTypes, permissions, settingsPanels, hooks)
- [ ] `src/lib/module-system/registry.ts` — `ModuleRegistry`-Klasse:
      `register(module)`, `getConfig()` (Module nacheinander anwenden)
- [ ] `src/lib/module-system/index.ts` — Singleton-Registry-Instanz
- [ ] `src/app-config.ts` — Root-Konfiguration (Core-Defaults + Modul-Registration)
- [ ] Unit-Tests für Registry: Module werden korrekt angewendet, Config akkumuliert

## Abnahmekriterien
- [ ] `ModuleRegistry.register(module)` ruft `module.register(config)` auf
- [ ] Mehrere Module können registriert werden, Config wird akkumuliert
- [ ] `AppConfig` enthält: `courseTypes[]`, `permissions[]`, `settingsPanels[]`, `hooks`
- [ ] TypeScript-Compile ohne Fehler

## Betroffene Dateien
- `src/lib/module-system/types.ts`, `registry.ts`, `index.ts` (neu)
- `src/app-config.ts` (neu)

## Notizen
