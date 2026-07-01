# T009: Drizzle-Schema für programs und courses anlegen

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T008

## Kontext
Konzept Abschnitt 3 & 4: Organization → Program → Course-Hierarchie. courses enthält
`course_type_id` und `config JSONB` für typ-spezifische Einstellungen.

## Ziel
Die Tabellen `programs` und `courses` existieren in der Datenbank. Das Domänenmodell
Organization → Program → Course ist vollständig als Drizzle-Schema abgebildet.

## Schritte
- [ ] `src/db/schema/programs.ts` — `id`, `org_id`, `title`, `description`, `created_at`, `updated_at`
- [ ] `src/db/schema/courses.ts` — `id`, `program_id` (FK), `course_type_id` (FK, wird T012 genutzt),
      `title`, `description`, `config JSONB`, `created_at`, `updated_at`
- [ ] `src/db/schema/course-types.ts` — Tabelle anlegen (Struktur aus Konzept Abschnitt 4),
      hartcodierte Einträge kommen per Seed (T012)
- [ ] Drizzle-Relations definieren
- [ ] Migration generieren und ausführen

## Abnahmekriterien
- [ ] `programs`-Tabelle mit `org_id`-FK auf organizations
- [ ] `courses`-Tabelle mit `program_id`-FK auf programs
- [ ] `course_types`-Tabelle vorhanden (erstmal leer, wird in T012 befüllt)
- [ ] TypeScript-Types korrekt inferiert

## Betroffene Dateien
- `src/db/schema/programs.ts`, `src/db/schema/courses.ts`, `src/db/schema/course-types.ts` (neu)
- `src/db/schema/index.ts`

## Notizen
