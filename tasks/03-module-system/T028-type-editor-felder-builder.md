# T028: Type-Editor UI — Felder-Builder-Komponente

**Phase:** 03-module-system
**Status:** offen
**Abhängig von:** T027

## Kontext
Konzept Abschnitt 3: "Felder zusammenklicken (Text, Markdown, Multiple-Choice, Code-Block,
Datei-Upload, ...) → Type entsteht ohne Code." Schema-Konfiguration für Admins.

## Ziel
Admins können über einen visuellen Felder-Builder neue Course-Types definieren, ohne Code
zu schreiben. Der Builder erzeugt eine valide `schema_definition`.

## Schritte
- [ ] `src/app/(app)/settings/course-types/page.tsx` — Liste aller Course-Types (inkl. Custom)
- [ ] `src/app/(app)/settings/course-types/new/page.tsx` — neuen Typ anlegen
- [ ] `src/components/type-editor/FieldBuilder.tsx` — Drag-and-Drop oder Liste: Felder
      hinzufügen, konfigurieren (Name, Typ, Required, etc.)
- [ ] `src/components/type-editor/FieldTypeSelector.tsx` — verfügbare Feld-Typen aus
      `schema-definition/field-types.ts`
- [ ] API: POST/PUT /api/course-types (Speichern der schema_definition in DB)
- [ ] System-Typen (markdown-info, flashcards, quiz) als schreibgeschützt markieren

## Abnahmekriterien
- [ ] Admin kann neuen Course-Type mit 2+ Feldern anlegen
- [ ] Type wird in `course_types`-Tabelle gespeichert (org_id gesetzt)
- [ ] System-Typen können nicht bearbeitet oder gelöscht werden
- [ ] Die erstellte schema_definition besteht `validateBlock()`-Check

## Betroffene Dateien
- `src/app/(app)/settings/course-types/` (neu)
- `src/components/type-editor/` (neu)
- `src/app/api/course-types/route.ts` (neu)

## Notizen
