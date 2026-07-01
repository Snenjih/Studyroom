# T041: Foren/Diskussionen-Modul — Datenmodell

**Phase:** 05-extensions
**Status:** offen
**Abhängig von:** T040

## Kontext
Konzept Abschnitt 9: "Foren/Diskussionen pro Kurs — ClassroomIO hat das bereits."
Diskussionen sind kurs-gebunden (kein globales Forum).

## Ziel
Das Datenmodell für Kurs-Diskussionen ist vorhanden. Threads und Posts können
erstellt, abgefragt und gelöscht werden.

## Schritte
- [ ] `src/db/schema/forum-threads.ts` — `id`, `course_id`, `author_id`, `title`,
      `created_at`, `is_pinned` (bool)
- [ ] `src/db/schema/forum-posts.ts` — `id`, `thread_id`, `author_id`, `content` (text),
      `created_at`, `updated_at`, `is_deleted` (bool, soft-delete)
- [ ] Migration generieren und ausführen
- [ ] `src/lib/db/forums.ts` — DAL: `getThreads()`, `getPosts()`, `createPost()`, `deletePost()`
- [ ] `src/modules/forums/index.ts` — `forumsModule: AppModule`

## Abnahmekriterien
- [ ] Tabellen vorhanden mit korrekten FKs
- [ ] Soft-Delete bei Posts (`is_deleted = true`, Inhalt bleibt erhalten)
- [ ] `getThreads()` gibt Threads sortiert nach Erstellungsdatum zurück
- [ ] Pinned Threads erscheinen immer oben

## Betroffene Dateien
- `src/db/schema/forum-threads.ts`, `forum-posts.ts` (neu)
- `src/lib/db/forums.ts`, `src/modules/forums/index.ts` (neu)

## Notizen
