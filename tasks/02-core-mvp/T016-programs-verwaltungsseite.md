# T016: Programs-Verwaltungsseite (Liste + Create/Edit/Delete UI)

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T015

## Kontext
Konzept Abschnitt 10 (Phase 1): Programs & Courses CRUD. Verwaltungsseite für
Trainer/Admin zum Verwalten von Programmen.

## Ziel
Trainer können Programme über eine UI-Seite anlegen, umbenennen und löschen.
Die Seite zeigt eine Liste aller Programme der Organisation.

## Schritte
- [ ] `src/app/(app)/programs/page.tsx` — Programme-Übersichtsliste (Server-Component)
- [ ] `src/app/(app)/programs/new/page.tsx` — Formular: Program erstellen
- [ ] `src/app/(app)/programs/[id]/edit/page.tsx` — Formular: Program bearbeiten
- [ ] `src/components/programs/ProgramForm.tsx` — gemeinsames Formular für Create/Edit
- [ ] Server Actions für Create/Update/Delete (statt separaten API-Calls aus UI)
- [ ] Lösch-Bestätigungsdialog (verhindert versehentliches Löschen)
- [ ] Redirect nach erfolgreichem Speichern

## Abnahmekriterien
- [ ] Program anlegen, umbenennen und löschen funktioniert über die UI
- [ ] Formularvalidierung zeigt Fehler inline an
- [ ] Nach Löschen eines Programs sind alle zugehörigen Courses mitgelöscht (DB-Cascade)
- [ ] Seite ist nur für Trainer/Admin zugänglich (Permission-Check)

## Betroffene Dateien
- `src/app/(app)/programs/page.tsx`, `/new/page.tsx`, `/[id]/edit/page.tsx` (neu)
- `src/components/programs/ProgramForm.tsx` (neu)

## Notizen
