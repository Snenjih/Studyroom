# T010: Drizzle-Schema für content_blocks anlegen

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T009

## Kontext
Konzept Abschnitt 4: `content_blocks`-Tabelle mit `content JSONB` für variablen Inhalt.
`block_type` muss gegen `course_types.schema_definition` validiert werden (App-Schicht, nicht DB).

## Ziel
Die Tabelle `content_blocks` existiert mit allen Spalten aus dem Konzept-Schema.
GIN-Index auf der `content`-JSONB-Spalte ist vorhanden.

## Schritte
- [x] `src/db/schema/content-blocks.ts` — alle Felder aus Konzept Abschnitt 4:
      `id`, `course_id` (FK ON DELETE CASCADE), `position`, `block_type`, `content JSONB`, `created_at`
- [x] GIN-Index auf `content`-Spalte für JSONB-Suche
- [x] Drizzle-Relation: course → content_blocks (1:n, ordered by position)
- [x] Helper-Types für die bekannten Block-Typen (Markdown, Flashcard, Quiz-Frage)
- [x] Migration generieren und ausführen

## Abnahmekriterien
- [x] `content_blocks`-Tabelle vorhanden mit `content JSONB NOT NULL`
- [x] GIN-Index auf `content` in der Migration
- [x] `ON DELETE CASCADE` bei `course_id` FK aktiv (Block wird gelöscht wenn Course gelöscht)
- [x] `position INT NOT NULL` für Sortierung vorhanden

## Betroffene Dateien
- `src/db/schema/content-blocks.ts` (neu)
- `src/db/schema/index.ts`

## Notizen
Helper-Types (`MarkdownBlockContent`, `FlashcardBlockContent`, `QuizQuestionBlockContent`)
liegen direkt in `content-blocks.ts` und werden per `jsonb('content').$type<BlockContent>()`
an die Spalte gebunden — reine TS-Typisierung, keine Laufzeit-Validierung (die kommt erst
mit T012/T027 Schema-Validierung). Migration `0006_lying_chamber.sql` erstellt und angewendet.
