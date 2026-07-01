# T021: Enrollments-API (einschreiben, austragen, Status)

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T020

## Kontext
Konzept Abschnitt 4: `enrollments`-Tabelle mit UNIQUE(user_id, course_id).
Einschreibung ist Voraussetzung für Fortschrittstracking.

## Ziel
Learner können sich in Kurse einschreiben und austragen. Trainer können Einschreibungen
verwalten. Die Einschreibung ist idempotent (doppelt einschreiben = kein Fehler).

## Schritte
- [x] `src/app/api/enrollments/route.ts` — POST: einschreiben (body: courseId)
- [x] `src/app/api/enrollments/[id]/route.ts` — DELETE: austragen; GET: Status abfragen
- [x] `src/app/api/courses/[id]/enrollments/route.ts` — GET: alle Einschreibungen des Kurses
      (nur für Trainer/Admin)
- [x] `src/lib/db/enrollments.ts` — DAL: `enrollUser()`, `unenrollUser()`, `getEnrollment()`
- [x] Fehlerbehandlung: Doppel-Einschreibung gibt 200 (idempotent, kein 409)
- [x] `enrollments:manage` Permission für Trainer ergänzen

## Abnahmekriterien
- [x] Einschreiben erstellt Enrollment-Eintrag
- [x] Zweimaliges Einschreiben gibt 200 ohne Datenbankfehler
- [x] Austragen setzt Status auf `inactive` (nicht DELETE des Eintrags — Verlauf erhalten)
- [x] Trainer sieht alle Einschreibungen seines Kurses

## Betroffene Dateien
- `src/app/api/enrollments/` (neu)
- `src/app/api/courses/[id]/enrollments/route.ts` (neu)
- `src/lib/db/enrollments.ts` (erweitert)
- `src/lib/db/courses.ts` (`courseBelongsToOrg` exportiert statt privat, Wiederverwendung)
- `src/lib/schemas/enrollment.ts` (neu, zod)
- `src/lib/permissions.ts` (`ENROLLMENTS_MANAGE` ergänzt)
- `src/db/seed-data/base-roles.ts` (Trainer-Rolle bekommt `enrollments:manage`)
- `src/db/schema/enrollments.ts` (`ENROLLMENT_STATUSES` um `inactive` ergänzt)

## Notizen
- `ENROLLMENT_STATUSES` (T011) kannte nur `active | completed | dropped`. Die Task
  verlangt explizit `inactive` als Austragen-Status — als vierten String-Wert ergänzt
  (kein DB-Enum, daher keine Migration nötig). `dropped` bleibt ungenutzt im Schema
  stehen für ein mögliches späteres "vom Trainer entfernt"-Szenario.
- Self-Service-Modell: Einschreiben/Austragen der EIGENEN Einschreibung braucht keine
  Permission, nur eine gültige Session. `enrollments:manage` wird nur für Zugriff auf
  FREMDE Einschreibungen (Trainer-Ansicht, Trainer trägt jemand anderen aus) geprüft.
- Wiedereinschreiben nach Austragen (`enrollUser`) reaktiviert die bestehende Zeile
  (`status: 'active'`, `completedAt: null`) statt eine zweite anzulegen — nötig wegen
  UNIQUE(user_id, course_id).
- End-to-End gegen eine echte Postgres-Instanz getestet (POST/GET/DELETE, Idempotenz,
  Reaktivierung, Trainer-Roster, 403 für Fremdzugriff) — siehe Zusammenfassung im Chat.

### Nachträgliche Korrektur nach Review-Subagent
- `enrollUser()` war ursprünglich select-then-insert (nicht atomar): zwei gleichzeitige
  erste Einschreibungsversuche (z.B. Doppelklick) hätten beide die "kein bestehender
  Eintrag"-Prüfung bestanden und wären beide auf den UNIQUE(user_id, course_id)-
  Constraint gelaufen — der zweite mit einem harten 500 statt des zugesagten
  "200, kein Datenbankfehler". Behoben durch einen einzigen atomaren
  `INSERT ... ON CONFLICT (user_id, course_id) DO UPDATE` (Drizzle
  `onConflictDoUpdate`), der unabhängig vom vorherigen Status immer auf `active`
  reaktiviert.
