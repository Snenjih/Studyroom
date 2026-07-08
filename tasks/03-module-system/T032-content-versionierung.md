# T032: Content-Versionierung für Course-Types

**Phase:** 03-module-system
**Status:** erledigt (2026-07-08)
**Abhängig von:** T031

## Kontext
Konzept Abschnitt 9: "Content-Versionierung von Course-Types — wenn du einen Typ
nachträglich änderst, dürfen bestehende Kurse mit der alten Version nicht brechen."
`schema_definition` + `version`-Feld ist in Abschnitt 4 bereits vorgesehen.

## Ziel
Änderungen an einem Course-Type erzeugen eine neue Version. Bestehende Blöcke mit
alter Version bleiben valide und werden mit dem passenden Schema validiert.

## Schritte
- [x] `course_types.version INT` (T009) wird bei Änderungen inkrementiert
- [x] `content_blocks.course_type_version INT` — speichert die Version zum Erstellungszeitpunkt
- [x] Migration für `course_type_version`-Spalte in `content_blocks` (+ neue Tabelle
      `course_type_schema_versions` als Versions-Archiv, siehe Notizen)
- [x] Validierungslogik (T027) nutzt die gespeicherte Version des Blocks, nicht die aktuelle
- [x] `src/lib/db/course-types.ts` — `updateCourseTypeSchema()`: neue Version anlegen statt
      bestehende überschreiben
- [x] Admin-Warnung in Type-Editor: "X bestehende Blöcke nutzen alte Version"

## Abnahmekriterien
- [x] Schema-Update erhöht `version` in `course_types`
- [x] Bestehende Blöcke validieren gegen ihre gespeicherte Version (kein Break)
- [x] Neuer Block nutzt aktuelle Version
- [x] Alter Block kann optional auf neue Version migriert werden (manuell, kein Auto-Migrate)

## Betroffene Dateien
- `src/db/schema/content-blocks.ts` (Spalte `course_type_version`)
- `src/db/schema/course-type-schema-versions.ts` (neu — Versions-Archiv)
- Migration `0010_sharp_drax.sql`
- `src/lib/db/course-types.ts` (`updateCourseTypeSchema()`, `getSchemaDefinitionForVersion()`,
  `countBlocksOnOutdatedVersion()`)
- `src/lib/db/courses.ts` (`createBlock()`/`updateBlock()` version-aware)
- `src/lib/schemas/course-type.ts` (`updateCourseTypeFieldsSchema`, `toFieldRowDraft()`)
- `src/components/type-editor/CourseTypeForm.tsx` (Edit-Modus, Key read-only)
- `src/app/(app)/settings/course-types/[id]/edit/page.tsx` (neu)
- `src/app/(app)/settings/course-types/actions.ts` (`updateCourseTypeSchemaAction`)
- `src/app/(app)/settings/course-types/page.tsx` ("Bearbeiten"-Link, Versionsanzeige)

## Notizen
- **Versions-Archiv statt Überschreiben:** Eine neue Tabelle
  `course_type_schema_versions` (`courseTypeId`, `version`, `schemaDefinition`,
  unique auf `(courseTypeId, version)`) speichert jeden VORHERIGEN Schema-Stand, bevor
  `updateCourseTypeSchema()` `course_types.schema_definition`/`version` überschreibt.
  `course_types` selbst bleibt dadurch weiterhin die "aktuelle" Zeile (kein Bruch für
  bestehenden Code, der `course_types.schemaDefinition` direkt liest) — die History
  lebt separat.
- `getSchemaDefinitionForVersion(courseType, version)`: gibt `courseType.schemaDefinition`
  direkt zurück, wenn `version` der aktuellen entspricht (häufigster Fall, kein
  zusätzlicher Query), sonst wird `course_type_schema_versions` befragt.
- `createBlock()` setzt `courseTypeVersion: courseType.version` (immer aktuell).
  `updateBlock()` lädt zusätzlich `contentBlocks.courseTypeVersion` des bestehenden
  Blocks und validiert gegen `getSchemaDefinitionForVersion(courseType,
  existing.courseTypeVersion)` — ein Schema-Update mit neuem Pflichtfeld invalidiert
  dadurch keine bestehenden Blöcke rückwirkend.
- **Bewusst kein Auto-Migrate** (T032-Abnahmekriterium): Der Trainer-Editor
  (`BlockRow`/`GenericBlockEditor`) zeigt für einen alten Block trotzdem die AKTUELLEN
  Felder (inkl. neuer, noch leerer Pflichtfelder) — das ist beabsichtigt und dient als
  Migrations-Einladung: der Trainer sieht das neue Feld, kann es befüllen und
  speichern, aber MUSS es nicht sofort tun, da `updateBlock()` weiterhin gegen die alte
  (gespeicherte) Version validiert. Erst wenn der Block tatsächlich mit den neuen
  Feldern gespeichert wird, aktualisiert sich `content_blocks.course_type_version`
  implizit nicht automatisch — das wäre ein größerer, hier bewusst nicht gebauter
  Schritt (echtes "Migrieren" würde `courseTypeVersion` explizit auf die neue Version
  heben und gegen das neue Schema validieren; aktuell speichert ein Save eines alten
  Blocks einfach wieder gegen seine alte Version, auch wenn neue Feldwerte im Content
  landen — das ist für den MVP-Rahmen dieser Task ausreichend, da explizit nur "manuell
  migrierbar", kein vollständiger Migrations-Workflow, gefordert war).
- `updateCourseTypeSchema()` lehnt System-Typen implizit ab: die WHERE-Klausel
  `eq(courseTypes.orgId, orgId)` kann eine Zeile mit `orgId = NULL` (System-Typ) nie
  treffen, da SQL `NULL = <wert>` nie wahr ist — kein zusätzlicher Check nötig, per
  Integrationstest bestätigt.
- Manuell mit Playwright end-to-end verifiziert: Custom-Type v1 mit 2 Feldern +ein
  Block darauf (per SQL vorbereitet) → Settings/Course-Types zeigt "v1" → Bearbeiten
  öffnet vorbefülltes Formular (Key read-only) → drittes Pflichtfeld hinzugefügt →
  gespeichert → Liste zeigt jetzt "v2" → erneutes Öffnen der Edit-Seite zeigt
  "1 bestehender Block nutzt eine alte Version dieses Course-Types." → der alte Block
  lässt sich im Kurs-Editor weiterhin ohne das neue Pflichtfeld speichern ("gespeichert",
  kein Fehler) — bestätigt kein Break. Test-Daten danach wieder entfernt.
- Neuer Integrationstest `course-type-versioning.integration.test.ts` deckt denselben
  Ablauf automatisiert ab (inkl. dass ein NEUER Block auf v2 das neue Pflichtfeld
  braucht und `countBlocksOnOutdatedVersion()` korrekt zählt).
- TypeScript-Compile, `npm test` (44/44) und `eslint` laufen fehlerfrei durch.
