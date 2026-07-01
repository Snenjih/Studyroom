# T022: Progress-Tracking-API (Block-Status, Kursfortschritt)

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T021

## Kontext
Konzept Abschnitt 4: `block_progress`-Tabelle mit Status/Score/Submission-Data.
Kursfortschritt = Anteil erledigter Blöcke an Gesamtblöcken.

## Ziel
Block-Fortschritt kann gesetzt und abgerufen werden. Kursfortschritt (%) wird berechnet
und im Dashboard (T015) angezeigt.

## Schritte
- [ ] `src/app/api/courses/[id]/progress/route.ts` — GET: Gesamtfortschritt (%)
- [ ] `src/app/api/blocks/[blockId]/progress/route.ts` — GET/PUT: Block-Status setzen
      (body: `{ status, score, submission_data }`)
- [ ] `src/lib/db/progress.ts` — `setBlockProgress()`, `getCourseProgress()`,
      `getBlockProgress(enrollmentId, blockId)`
- [ ] `getCourseProgress()`: COUNT(done/failed blocks) / COUNT(total blocks) * 100
- [ ] Upsert-Logik in `setBlockProgress()` (Update wenn vorhanden, Insert wenn neu)
- [ ] Course-Completion-Check: wenn alle Blöcke done → `enrollments.completed_at` setzen

## Abnahmekriterien
- [ ] PUT /blocks/:id/progress setzt Block-Status korrekt (Upsert)
- [ ] GET /courses/:id/progress gibt Prozentzahl zurück (0–100)
- [ ] Kurs-Completion wird erkannt: `enrollments.completed_at` gesetzt
- [ ] Kein Progress möglich ohne aktive Einschreibung (403)

## Betroffene Dateien
- `src/app/api/courses/[id]/progress/route.ts` (neu)
- `src/app/api/blocks/[blockId]/progress/route.ts` (neu)
- `src/lib/db/progress.ts` (neu)

## Notizen
