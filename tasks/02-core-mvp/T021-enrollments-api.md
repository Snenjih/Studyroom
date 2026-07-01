# T021: Enrollments-API (einschreiben, austragen, Status)

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T020

## Kontext
Konzept Abschnitt 4: `enrollments`-Tabelle mit UNIQUE(user_id, course_id).
Einschreibung ist Voraussetzung für Fortschrittstracking.

## Ziel
Learner können sich in Kurse einschreiben und austragen. Trainer können Einschreibungen
verwalten. Die Einschreibung ist idempotent (doppelt einschreiben = kein Fehler).

## Schritte
- [ ] `src/app/api/enrollments/route.ts` — POST: einschreiben (body: courseId)
- [ ] `src/app/api/enrollments/[id]/route.ts` — DELETE: austragen; GET: Status abfragen
- [ ] `src/app/api/courses/[id]/enrollments/route.ts` — GET: alle Einschreibungen des Kurses
      (nur für Trainer/Admin)
- [ ] `src/lib/db/enrollments.ts` — DAL: `enrollUser()`, `unenrollUser()`, `getEnrollment()`
- [ ] Fehlerbehandlung: Doppel-Einschreibung gibt 200 (idempotent, kein 409)
- [ ] `enrollments:manage` Permission für Trainer ergänzen

## Abnahmekriterien
- [ ] Einschreiben erstellt Enrollment-Eintrag
- [ ] Zweimaliges Einschreiben gibt 200 ohne Datenbankfehler
- [ ] Austragen setzt Status auf `inactive` (nicht DELETE des Eintrags — Verlauf erhalten)
- [ ] Trainer sieht alle Einschreibungen seines Kurses

## Betroffene Dateien
- `src/app/api/enrollments/` (neu)
- `src/app/api/courses/[id]/enrollments/route.ts` (neu)
- `src/lib/db/enrollments.ts` (neu)

## Notizen
