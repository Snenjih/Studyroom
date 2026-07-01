# T016: Programs-Verwaltungsseite (Liste + Create/Edit/Delete UI)

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T015

## Kontext
Konzept Abschnitt 10 (Phase 1): Programs & Courses CRUD. Verwaltungsseite für
Trainer/Admin zum Verwalten von Programmen.

## Ziel
Trainer können Programme über eine UI-Seite anlegen, umbenennen und löschen.
Die Seite zeigt eine Liste aller Programme der Organisation.

## Schritte
- [x] `src/app/(app)/programs/page.tsx` — Programme-Übersichtsliste (Server-Component)
- [x] `src/app/(app)/programs/new/page.tsx` — Formular: Program erstellen
- [x] `src/app/(app)/programs/[id]/edit/page.tsx` — Formular: Program bearbeiten
- [x] `src/components/programs/ProgramForm.tsx` — gemeinsames Formular für Create/Edit
- [x] Server Actions für Create/Update/Delete (statt separaten API-Calls aus UI)
- [x] Lösch-Bestätigungsdialog (verhindert versehentliches Löschen)
- [x] Redirect nach erfolgreichem Speichern

## Abnahmekriterien
- [x] Program anlegen, umbenennen und löschen funktioniert über die UI
- [x] Formularvalidierung zeigt Fehler inline an
- [x] Nach Löschen eines Programs sind alle zugehörigen Courses mitgelöscht (DB-Cascade)
- [x] Seite ist nur für Trainer/Admin zugänglich (Permission-Check)

## Betroffene Dateien
- `src/app/(app)/programs/page.tsx`, `/new/page.tsx`, `/[id]/edit/page.tsx` (neu)
- `src/components/programs/ProgramForm.tsx` (neu)

## Notizen
Design mit dem `frontend-design`-Skill erarbeitet, konsistent zum Dashboard-Look
(Terminal/Electric-Aqua). Zugriffsschutz läuft über `hasPermission` + `notFound()` direkt
auf Seitenebene (nicht nur in den Server Actions) — nicht eingeloggte Nutzer ohne
`programs:manage` sehen eine 404 statt der Verwaltungsseite. Lösch-Bestätigung über
natives `<dialog>` (kein zusätzliches UI-Framework nötig). Formular-Validierungsfehler
kommen aus demselben Zod-Schema wie die API-Routes (T013) und werden per
`useActionState`/`ZodError.flatten().fieldErrors` inline angezeigt.

GET-Routen (Liste, New-Formular) und der Permission-Gate (404 ohne `programs:manage`)
wurden gegen die laufende Dev-Instanz verifiziert. Das eigentliche Abschicken der
Server Actions (Create/Update/Delete) ließ sich nicht per curl nachstellen, da React
Server Actions bei `useActionState` ein internes Action-Reference-Protokoll (verschlüsselte
Action-ID + gebundene Argumente als Formularfelder) nutzen, das nur ein echter Browser
korrekt erzeugt — in diesem Sandbox-Setup war kein Headless-Browser verfügbar. Die
aufgerufene DAL-Logik (`createProgram`/`updateProgram`/`deleteProgram`) ist identisch zu
der bereits in T013 end-to-end getesteten API-Schicht. Empfehlung: vor dem nächsten
Deploy einmal manuell im Browser durchklicken.
