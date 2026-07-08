# T028: Type-Editor UI — Felder-Builder-Komponente

**Phase:** 03-module-system
**Status:** erledigt (2026-07-08)
**Abhängig von:** T027

## Kontext
Konzept Abschnitt 3: "Felder zusammenklicken (Text, Markdown, Multiple-Choice, Code-Block,
Datei-Upload, ...) → Type entsteht ohne Code." Schema-Konfiguration für Admins.

## Ziel
Admins können über einen visuellen Felder-Builder neue Course-Types definieren, ohne Code
zu schreiben. Der Builder erzeugt eine valide `schema_definition`.

## Schritte
- [x] `src/app/(app)/settings/course-types/page.tsx` — Liste aller Course-Types (inkl. Custom)
- [x] `src/app/(app)/settings/course-types/new/page.tsx` — neuen Typ anlegen
- [x] `src/components/type-editor/FieldBuilder.tsx` — Liste: Felder hinzufügen,
      konfigurieren (Name, Typ, Required, + typ-spezifische Extras)
- [x] `src/components/type-editor/FieldTypeSelector.tsx` — verfügbare Feld-Typen aus
      `schema-definition/field-types.ts`
- [x] API: POST /api/course-types (Speichern der schema_definition in DB)
- [x] System-Typen (markdown-info, flashcards, quiz) als schreibgeschützt markiert

## Abnahmekriterien
- [x] Admin kann neuen Course-Type mit 2+ Feldern anlegen
- [x] Type wird in `course_types`-Tabelle gespeichert (org_id gesetzt)
- [x] System-Typen können nicht bearbeitet oder gelöscht werden
- [x] Die erstellte schema_definition besteht `validateBlock()`-Check

## Betroffene Dateien
- `src/app/(app)/settings/course-types/` (neu: `page.tsx`, `new/page.tsx`, `actions.ts`)
- `src/components/type-editor/` (neu: `FieldBuilder.tsx`, `FieldTypeSelector.tsx`,
  `CourseTypeForm.tsx`)
- `src/app/api/course-types/route.ts` (neu)
- `src/lib/db/course-types.ts` (neu)
- `src/lib/schemas/course-type.ts` (neu)
- `src/app/(app)/settings/page.tsx` (Link zu Course-Types ergänzt)

## Notizen
- Kein Drag-and-Drop — eine einfache geordnete Liste mit Hinzufügen/Entfernen reicht für
  den MVP-Felder-Builder und ist deutlich weniger Aufwand/Fehlerquellen.
- Ein Custom-Course-Type entspricht **einem** Block-Typ (fester interner Key `"content"`
  in `schema_definition.allowedBlockTypes`) — der Felder-Builder aus dem Konzept
  beschreibt "Felder zusammenklicken", nicht mehrere Block-Typen pro Type verwalten;
  das bleibt dem (noch nicht gebauten) Custom-Engine-Modul-Pfad vorbehalten.
- Custom-Types laufen immer über `executionEngine: 'generic'` (kein Dropdown dafür) —
  passt zum Zwei-Stufen-Modell aus Konzept Abschnitt 3: die einfache Schema-Konfiguration
  bekommt automatisch den generischen Renderer/Progress-Regeln aus T029, "richtige"
  Custom-Engines bleiben Entwickler-Code (eigenes AppModule).
- Bewusst nur Basis-Constraints in der UI (Name, Typ, Required, bei `select` Optionen
  kommagetrennt, bei `array` Item-Typ) — min/maxLength, min/max, minItems/maxItems aus
  T026 bleiben vorerst nur programmatisch setzbar, keine UI dafür nötig für die
  Abnahmekriterien dieser Task.
- `PERMISSIONS.SETTINGS_MANAGE` gated sowohl die Liste als auch das Anlegen — keine neue
  Permission eingeführt, da die Seite unter `/settings/` hängt und Course-Type-Verwaltung
  inhaltlich eine Settings-Aufgabe ist.
- "System-Typen können nicht bearbeitet oder gelöscht werden" ist aktuell dadurch erfüllt,
  dass es schlicht noch keine Edit/Delete-Funktion für irgendeinen Course-Type gibt (auch
  nicht für Custom-Types) — nur `createCourseType()` existiert. Editierbarkeit mit
  Versions-Handling ist explizit Aufgabe von T032.
- Manuell mit Playwright end-to-end verifiziert: Login → Settings → Course-Types → Neuer
  Course-Type → 2 Felder (Text + Auswahl mit 3 Optionen) → anlegen → Redirect zur Liste,
  neuer Typ erscheint als "Custom", alle drei System-Typen weiterhin als "System ·
  schreibgeschützt". Test-Datensatz danach wieder aus der Dev-DB entfernt.
- Neue Tests: `src/lib/schemas/course-type.test.ts` (Zod-Schema + `toFieldDefinition()`)
  und `src/lib/db/course-types.integration.test.ts` (echte DB, analog T027) — inkl.
  Bestätigung, dass eine erzeugte `schemaDefinition` `validateBlock()` besteht.
- TypeScript-Compile, `npm test` (29/29) und `eslint` laufen fehlerfrei durch.
