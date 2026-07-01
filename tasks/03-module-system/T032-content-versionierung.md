# T032: Content-Versionierung für Course-Types

**Phase:** 03-module-system
**Status:** offen
**Abhängig von:** T031

## Kontext
Konzept Abschnitt 9: "Content-Versionierung von Course-Types — wenn du einen Typ
nachträglich änderst, dürfen bestehende Kurse mit der alten Version nicht brechen."
`schema_definition` + `version`-Feld ist in Abschnitt 4 bereits vorgesehen.

## Ziel
Änderungen an einem Course-Type erzeugen eine neue Version. Bestehende Blöcke mit
alter Version bleiben valide und werden mit dem passenden Schema validiert.

## Schritte
- [ ] `course_types.version INT` (T009) wird bei Änderungen inkrementiert
- [ ] `content_blocks.course_type_version INT` — speichert die Version zum Erstellungszeitpunkt
- [ ] Migration für `course_type_version`-Spalte in `content_blocks`
- [ ] Validierungslogik (T027) nutzt die gespeicherte Version des Blocks, nicht die aktuelle
- [ ] `src/lib/db/course-types.ts` — `updateCourseTypeSchema()`: neue Version anlegen statt
      bestehende überschreiben
- [ ] Admin-Warnung in Type-Editor: "X bestehende Blöcke nutzen alte Version"

## Abnahmekriterien
- [ ] Schema-Update erhöht `version` in `course_types`
- [ ] Bestehende Blöcke validieren gegen ihre gespeicherte Version (kein Break)
- [ ] Neuer Block nutzt aktuelle Version
- [ ] Alter Block kann optional auf neue Version migriert werden (manuell, kein Auto-Migrate)

## Betroffene Dateien
- `src/db/schema/content-blocks.ts` (Spalte ergänzen)
- `src/lib/db/course-types.ts` (neu/erweitert)
- `src/components/type-editor/FieldBuilder.tsx`

## Notizen
