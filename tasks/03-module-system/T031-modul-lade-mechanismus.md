# T031: Modul-Lade-Mechanismus (Konfigurationsbasiert)

**Phase:** 03-module-system
**Status:** erledigt (2026-07-08)
**Abhängig von:** T030

## Kontext
Konzept Abschnitt 2: Module sind an/abschaltbar. Konfiguration bestimmt, welche Module
aktiv sind. Settings-Panel zeigt aktive/inaktive Module.

## Ziel
Module können über eine Konfigurationsdatei oder Settings ein-/ausgeschaltet werden.
Nur aktive Module werden beim App-Start in der Registry registriert.

## Schritte
- [x] `src/config/modules.config.ts` — Liste aktivierter Module-Keys (aus `ENABLED_MODULES`-Env)
- [x] `src/app-config.ts` — lädt nur Module aus `modules.config.ts`
- [x] Settings-Seite: `src/app/(app)/settings/modules/page.tsx` — Liste aller verfügbaren
      Module (aktiv/inaktiv), kurze Beschreibung
- [x] API: POST `/api/settings/modules/[key]/toggle` — Modul aktivieren/deaktivieren
- [x] Änderung erfordert App-Neustart (klar in der UI kommuniziert)

## Abnahmekriterien
- [x] Ein Modul kann in der Config deaktiviert werden — sein CourseType erscheint nicht mehr
- [x] Settings zeigt welche Module aktiv sind
- [x] Deaktiviertes Modul-Permission taucht nicht mehr in der Rollen-UI auf
- [x] Bestehende Kurse mit deaktiviertem Type zeigen Fallback-Hinweis (nicht 500)

## Betroffene Dateien
- `src/config/modules.config.ts`, `modules.config.test.ts` (neu)
- `src/app/(app)/settings/modules/page.tsx` (neu)
- `src/app/api/settings/modules/[key]/toggle/route.ts` (neu)
- `src/lib/db/module-toggles.ts` (neu)
- `src/components/settings/ModuleToggleButton.tsx` (neu)
- `src/app-config.ts` (lädt jetzt über `modules.config.ts`, `server-only`)
- `src/components/courses/BlockList.tsx`, `BlockRow.tsx` (Bugfix, siehe Notizen)
- `src/lib/module-system/types.ts` (`AppModule.name`/`description` ergänzt)
- `src/modules/course-types/*/index.ts` (Name/Beschreibung ergänzt)

## Notizen
- **Zwei-Ebenen-Design, bewusst so:** Ob ein Modul TATSÄCHLICH registriert wird,
  entscheidet ausschließlich die `ENABLED_MODULES`-Umgebungsvariable (kommagetrennte
  Keys), synchron ausgelesen beim Prozessstart in `modules.config.ts`. Der
  Toggle-Button/API in den Settings schreibt nur einen "gewünschten Ziel-Zustand" in
  `org_settings` (`disabledModuleKeys`) — rein informativ für die UI ("wirkt nach
  Neustart"), er verändert die laufende Registry nicht. Grund: Next.js hat im App
  Router keinen zuverlässigen Hook, um einen laufenden Prozess zur Laufzeit neu zu
  konfigurieren, und ein DB-Zugriff direkt in `modules.config.ts`/`app-config.ts` wäre
  nicht möglich, ohne die Client/Server-Trennung zu brechen (siehe nächster Punkt).
- **Echter Bug gefunden und gefixt** (durch manuelles Testen mit echtem
  `ENABLED_MODULES`-Wert, nicht durch Unit-Tests erkennbar): `BlockRow.tsx`
  (Client-Komponente) importierte `getCourseTypeModule` direkt aus `app-config.ts`.
  `process.env.ENABLED_MODULES` ist im Browser-Bundle aber unsichtbar (Next.js inlined
  nur `NEXT_PUBLIC_*`-Vars) — der Client sah dadurch IMMER alle Module als aktiv,
  unabhängig vom echten Server-Zustand. Bei einem deaktivierten Modul rendert der
  Server also den Generic-Fallback, der Client versucht aber den (fälschlich für
  registriert gehaltenen) Original-Editor zu hydrieren → React-Hydration-Mismatch,
  sichtbar als Konsolenfehler und als kurz aufblitzender, dann falsch nachgeladener
  Editor. Fix: `BlockList.tsx` (Server-Komponente) löst `getCourseTypeModule()` jetzt
  serverseitig auf und reicht die fertige Editor-Komponenten-Referenz als Prop an
  `BlockRow` durch — `BlockRow` importiert `app-config.ts` gar nicht mehr.
  `app-config.ts` bekam zusätzlich `import 'server-only'` als Build-Zeit-Absicherung
  gegen zukünftige Regressionen dieser Art (ein versehentlicher Import aus einer
  Client-Komponente bricht jetzt den Build sofort, statt einen stillen Hydration-Bug
  zu erzeugen).
- "Deaktiviertes Modul-Permission taucht nicht mehr in der Rollen-UI auf" ist bereits
  durch T030s Architektur abgedeckt: `listAssignablePermissions()` liest
  `getConfig().permissions`, das ein deaktiviertes Modul naturgemäß nicht mehr enthält
  — keine zusätzliche Logik nötig.
- "Bestehende Kurse mit deaktiviertem Type zeigen Fallback-Hinweis" ist ebenfalls
  größtenteils bereits durch T029s Architektur abgedeckt: `fields` kommt aus der
  DB-gespeicherten `schema_definition` (unabhängig vom Modul-Registrierungsstatus), der
  Generic-Renderer/Editor greift also automatisch, sobald ein Modul nicht registriert
  ist — inklusive für die drei Basis-Typen, nicht nur für Custom-Types.
- Manuell mit Playwright + echtem Server-Neustart verifiziert:
  `ENABLED_MODULES=markdown-info,flashcards` (quiz weggelassen) → Settings/Module zeigt
  quiz als "Inaktiv" → bestehender Quiz-Kurs (vorher per SQL angelegt) zeigt auf
  Edit- und Lern-Seite den generischen Fallback statt 500/Crash, kein
  Hydration-Mismatch mehr in der Konsole. Zusätzlich der Toggle-Button selbst getestet
  (Deaktivieren-Klick → "— Deaktivierung nach Neustart wirksam"-Hinweis erscheint).
  Test-Daten und `org_settings`-Eintrag danach wieder entfernt.
- TypeScript-Compile, `npm test` (41/41) und `eslint` laufen fehlerfrei durch.
