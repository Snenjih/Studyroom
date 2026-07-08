# T029: Type-Editor UI — Vorschau-Renderer für Custom-Types

**Phase:** 03-module-system
**Status:** erledigt (2026-07-08)
**Abhängig von:** T028

## Kontext
Konzept Abschnitt 3: Zwei-Stufen-System — Schema-Konfiguration (kein Code) für
einfache Typen. Der generische Renderer zeigt Felder basierend auf schema_definition an,
ohne dass ein Custom-Renderer geschrieben werden muss.

## Ziel
Selbst definierte Course-Types können von Learnern genutzt werden, ohne dass ein
Custom-Renderer-Modul nötig ist. Ein generischer Renderer zeigt alle Felder des Schemas.

## Schritte
- [x] `src/components/course-renderer/GenericBlockRenderer.tsx` — rendert Felder
      dynamisch aus schema_definition (Text → Textanzeige, Markdown → gerendert, etc.)
- [x] `src/components/course-renderer/GenericBlockEditor.tsx` — generischer Editor
      (passende Input-Felder je nach Feld-Typ)
- [x] Kurs-Lern-Seite (T018) nutzt Generic-Renderer als Fallback, wenn kein Custom-Renderer
      im AppConfig registriert ist
- [x] Progress-Regel für Generic-Types: Block gilt als `done` nach erster Interaktion

## Abnahmekriterien
- [x] Ein über T028 erstellter Custom-Type kann in einem Kurs verwendet werden
- [x] Learner kann den Generic-Block aufrufen und abschließen
- [x] Trainer kann Generic-Block über Generic-Editor befüllen
- [x] Kein Fehler wenn Custom-Type alle unterstützten Feld-Typen enthält

## Betroffene Dateien
- `src/components/course-renderer/GenericBlockRenderer.tsx` (neu)
- `src/components/course-renderer/GenericBlockEditor.tsx` (neu)
- `src/app/(app)/courses/[id]/learn/page.tsx`
- `src/components/courses/BlockRow.tsx`, `BlockList.tsx`, `AddBlockButton.tsx`
- `src/app/(app)/courses/[id]/edit/page.tsx`
- `src/lib/block-defaults.ts` (Bugfix, siehe Notizen)

## Notizen
- Progress-Regel: "done nach erster Interaktion" = explizite Bestätigung über einen
  "Abschließen"-Button im `GenericBlockRenderer` (kein automatisches Done wie bei
  `executionEngine: 'static'`) — es gibt keine Korrektheitsbewertung, nur eine
  Sichtbarkeits-/Gelesen-Bestätigung.
- Wiring: `BlockList`/`BlockRow` (Trainer-Editor-Seite) und `learn/page.tsx`
  (Lern-Seite) lösen pro Block die passenden `FieldDefinition[]` über
  `course.courseType.schemaDefinition.allowedBlockTypes.find(bt => bt.type ===
  block.blockType)?.fields` auf und reichen sie als Fallback durch, wenn
  `getCourseTypeModule(courseTypeKey)` (T025, nur für die drei Basis-Typen) nichts
  liefert.
- **Echter Bug gefunden und gefixt** (durch manuelles Playwright-Testen, nicht durch
  die Typprüfung erkennbar): `defaultBlockContent()` (`src/lib/block-defaults.ts`)
  kannte den generischen Fall nicht und gab für jeden Custom-Block-Type ein leeres
  `{}` zurück — Pflichtfelder fehlten dadurch komplett (nicht nur leer, sondern gar
  nicht vorhanden), wodurch `validateBlock()` (T027) den frisch angelegten Block sofort
  ablehnte und `addBlockAction` mit einem unbehandelten 500 abstürzte, sobald man in
  der UI auf "+ Hinzufügen" für einen Custom-Type klickte. Fix: `defaultBlockContent()`
  akzeptiert jetzt optional `fields: FieldDefinition[]` und leitet einen Default-Wert
  pro Feld-Typ ab (`''` für text/markdown, `0` für number, `false` für boolean, erste
  Option für select, `[]` für array) — `AddBlockButton.tsx` reicht die passenden
  Felder aus `allowedBlockTypes` durch. Regressionstest in
  `src/lib/block-defaults.test.ts`.
- Nebenbei einen zweiten, latenten Zuverlässigkeits-Bug im `test`-npm-Script (seit
  T024) gefunden und gefixt: `src/**/*.test.ts` ohne Anführungszeichen wird je nach
  aufrufender Shell unterschiedlich expandiert (bash ohne `globstar` matcht nur eine
  Verzeichnisebene, `npm`s interner `sh` ggf. noch anders) — dadurch liefen bei manchen
  `npm test`-Aufrufen nur 1 von 6 Testdateien, ohne Fehlermeldung. Jetzt in
  `package.json` als `\"src/**/*.test.ts\"` gequotet, sodass Node selbst den Glob
  auflöst (Node unterstützt das seit v20).
- Manuell mit Playwright komplett end-to-end verifiziert: Login → Custom-Type mit 3
  Feldern (text, markdown, array) anlegen (T028) → Program/Kurs mit diesem Typ anlegen
  → Content-Block hinzufügen → über `GenericBlockEditor` befüllen (inkl. Array-Editor
  mit "+ Eintrag hinzufügen") → speichern → Lern-Seite: `GenericBlockRenderer` zeigt
  Markdown gerendert (`**Fett**` → fett) und die Tag-Liste an → "Abschließen" geklickt
  → Status wechselt zu "✓ Abgeschlossen". Test-Daten danach wieder aus der Dev-DB
  entfernt.
- TypeScript-Compile, `npm test` (32/32) und `eslint` laufen fehlerfrei durch.
