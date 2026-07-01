# T017: Courses-Verwaltungsseite (Liste + Create/Edit/Delete UI)

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T016

## Kontext
Konzept Abschnitt 10 (Phase 1): Programs & Courses CRUD. Kurs-Editor muss den
Course-Type berücksichtigen und erlaubt das Hinzufügen/Sortieren von Blöcken.

## Ziel
Trainer können innerhalb eines Programs Kurse anlegen, den passenden Course-Type
wählen, Content-Blöcke hinzufügen und sortieren.

## Schritte
- [ ] `src/app/(app)/programs/[programId]/courses/page.tsx` — Kursliste im Program
- [ ] `src/app/(app)/programs/[programId]/courses/new/page.tsx` — Kurs erstellen (Typ wählen)
- [ ] `src/app/(app)/courses/[id]/edit/page.tsx` — Kurs-Editor mit Block-Liste
- [ ] `src/components/courses/CourseForm.tsx` — Formular: Titel, Typ, Beschreibung
- [ ] `src/components/courses/BlockList.tsx` — sortierbare Block-Liste (Drag-and-Drop optional,
      Up/Down-Buttons als Fallback)
- [ ] `src/components/courses/AddBlockButton.tsx` — Block-Typ aus dem Course-Type-Schema wählen
- [ ] Server Actions für Course + Block CRUD

## Abnahmekriterien
- [ ] Kurs anlegen mit Typ-Auswahl funktioniert
- [ ] Blöcke können dem Kurs hinzugefügt, bearbeitet und entfernt werden
- [ ] Block-Reihenfolge kann geändert werden
- [ ] Nur erlaubte Block-Typen lt. Course-Type-Schema sind auswählbar

## Betroffene Dateien
- `src/app/(app)/programs/[programId]/courses/` (neu)
- `src/app/(app)/courses/[id]/edit/page.tsx` (neu)
- `src/components/courses/` (neu)

## Notizen
