# T022: Progress-Tracking-API (Block-Status, Kursfortschritt)

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T021

## Kontext
Konzept Abschnitt 4: `block_progress`-Tabelle mit Status/Score/Submission-Data.
Kursfortschritt = Anteil erledigter Blöcke an Gesamtblöcken.

## Ziel
Block-Fortschritt kann gesetzt und abgerufen werden. Kursfortschritt (%) wird berechnet
und im Dashboard (T015) angezeigt.

## Schritte
- [x] `src/app/api/courses/[id]/progress/route.ts` — GET: Gesamtfortschritt (%)
- [x] `src/app/api/blocks/[blockId]/progress/route.ts` — GET/PUT: Block-Status setzen
      (body: `{ status, score, submissionData }`)
- [x] `src/lib/db/progress.ts` — `setBlockProgress()`, `getCourseProgress()`,
      `getBlockProgress(enrollmentId, blockId)`
- [x] `getCourseProgress()`: COUNT(done/failed blocks) / COUNT(total blocks) * 100
- [x] Upsert-Logik in `setBlockProgress()` (Update wenn vorhanden, Insert wenn neu)
- [x] Course-Completion-Check: wenn alle Blöcke done → `enrollments.completed_at` setzen

## Abnahmekriterien
- [x] PUT /blocks/:id/progress setzt Block-Status korrekt (Upsert)
- [x] GET /courses/:id/progress gibt Prozentzahl zurück (0–100)
- [x] Kurs-Completion wird erkannt: `enrollments.completed_at` gesetzt
- [x] Kein Progress möglich ohne aktive Einschreibung (403)

## Betroffene Dateien
- `src/app/api/courses/[id]/progress/route.ts` (neu)
- `src/app/api/blocks/[blockId]/progress/route.ts` (neu)
- `src/lib/db/progress.ts` (neu)
- `src/lib/schemas/progress.ts` (neu, zod)
- `src/lib/db/enrollments.ts` (`UpsertBlockProgressInput`-Typ exportiert, von T022
  wiederverwendet statt dupliziert)

## Notizen
- Bewusste Abweichung von der Doku-Formulierung: `submission_data` im Request-Body ist
  `submissionData` (camelCase), konsistent zu allen bisherigen zod-Schemas/DAL-Signaturen
  im Projekt (z.B. `learn-actions.ts`).
- Prozent-Formel zählt `done` UND `failed` als "bearbeitet" (T022-Vorgabe wörtlich).
  Die Completion-Regel ("alle Blöcke done") zählt bewusst NUR `done`, nicht `failed` —
  ein Kurs mit einem endgültig fehlgeschlagenen Block gilt nicht als abgeschlossen,
  auch wenn er zu 100% "bearbeitet" ist. Das ist eine bewusste Interpretation der
  Aufgabenstellung, kein Bug.
- Bug während der eigenen Verifikation gefunden und behoben: Der ursprüngliche
  Zugriffscheck ließ nur Einschreibungen mit Status `active` zu. Sobald
  `checkCourseCompletion()` eine Einschreibung auf `completed` setzt, hätte der
  Lernende seinen eigenen (fertigen) Fortschritt danach nicht mehr abrufen können
  (403 "Keine aktive Einschreibung"). Fix: `ACCESSIBLE_ENROLLMENT_STATUSES = ['active',
  'completed']` in `src/lib/db/progress.ts` — nur explizit ausgetragene (`inactive`/
  `dropped`) Einschreibungen sind gesperrt.
- `dashboard.ts` (`getEnrolledCourses`, T015) hat weiterhin seine eigene, leicht
  andere Fortschrittsformel (nur `done`, ohne `failed`) für die Dashboard-Kachel —
  bewusst NICHT auf die neue `getCourseProgress()` umgestellt, um nicht über den
  Task-Scope hinaus an T015 zu rühren. Falls gewünscht, wäre das Zusammenführen eine
  gute Folge-Aufräumarbeit (nicht Teil dieser Task).
- End-to-End gegen eine echte Postgres-Instanz getestet (Enroll → 0% → 50% → 100%
  → completed_at gesetzt → 403 nach Austragen), siehe Zusammenfassung im Chat.
