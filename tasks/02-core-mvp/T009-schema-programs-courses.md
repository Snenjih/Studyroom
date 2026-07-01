# T009: Drizzle-Schema für programs und courses anlegen

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T008

## Kontext
Konzept Abschnitt 3 & 4: Organization → Program → Course-Hierarchie. courses enthält
`course_type_id` und `config JSONB` für typ-spezifische Einstellungen.

## Ziel
Die Tabellen `programs` und `courses` existieren in der Datenbank. Das Domänenmodell
Organization → Program → Course ist vollständig als Drizzle-Schema abgebildet.

## Schritte
- [x] `src/db/schema/programs.ts` — `id`, `org_id`, `title`, `description`, `created_at`, `updated_at`
- [x] `src/db/schema/courses.ts` — `id`, `program_id` (FK), `course_type_id` (FK, wird T012 genutzt),
      `title`, `description`, `config JSONB`, `created_at`, `updated_at`
- [x] `src/db/schema/course-types.ts` — Tabelle anlegen (Struktur aus Konzept Abschnitt 4),
      hartcodierte Einträge kommen per Seed (T012)
- [x] Drizzle-Relations definieren
- [x] Migration generieren und ausführen

## Abnahmekriterien
- [x] `programs`-Tabelle mit `org_id`-FK auf organizations
- [x] `courses`-Tabelle mit `program_id`-FK auf programs
- [x] `course_types`-Tabelle vorhanden (erstmal leer, wird in T012 befüllt)
- [x] TypeScript-Types korrekt inferiert

## Betroffene Dateien
- `src/db/schema/programs.ts`, `src/db/schema/courses.ts`, `src/db/schema/course-types.ts` (neu)
- `src/db/schema/index.ts`

## Notizen
`courses.program_id` mit `ON DELETE CASCADE` versehen (nicht explizit in der Task gefordert,
aber Abnahmekriterium von T016 verlangt kaskadierendes Löschen von Courses beim Löschen
eines Programs). `course_types.org_id` ist nullable (NULL = System-Default-Typ, Konzept
Abschnitt 4). Migration `0005_damp_morgan_stark.sql` erstellt und gegen lokale Postgres-
Instanz angewendet.
