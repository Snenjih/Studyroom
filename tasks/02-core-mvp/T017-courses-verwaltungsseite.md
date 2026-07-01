# T017: Courses-Verwaltungsseite (Liste + Create/Edit/Delete UI)

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T016

## Kontext
Konzept Abschnitt 10 (Phase 1): Programs & Courses CRUD. Kurs-Editor muss den
Course-Type berücksichtigen und erlaubt das Hinzufügen/Sortieren von Blöcken.

## Ziel
Trainer können innerhalb eines Programs Kurse anlegen, den passenden Course-Type
wählen, Content-Blöcke hinzufügen und sortieren.

## Schritte
- [x] `src/app/(app)/programs/[id]/courses/page.tsx` — Kursliste im Program (Pfad-Parameter
      `id` statt `programId`, siehe Notizen)
- [x] `src/app/(app)/programs/[id]/courses/new/page.tsx` — Kurs erstellen (Typ wählen)
- [x] `src/app/(app)/courses/[id]/edit/page.tsx` — Kurs-Editor mit Block-Liste
- [x] `src/components/courses/CourseForm.tsx` — Formular: Titel, Typ, Beschreibung
- [x] `src/components/courses/BlockList.tsx` — sortierbare Block-Liste (Up/Down-Buttons,
      kein Drag-and-Drop)
- [x] `src/components/courses/AddBlockButton.tsx` — Block-Typ aus dem Course-Type-Schema wählen
- [x] Server Actions für Course + Block CRUD

## Abnahmekriterien
- [x] Kurs anlegen mit Typ-Auswahl funktioniert
- [x] Blöcke können dem Kurs hinzugefügt, bearbeitet und entfernt werden
- [x] Block-Reihenfolge kann geändert werden
- [x] Nur erlaubte Block-Typen lt. Course-Type-Schema sind auswählbar

## Betroffene Dateien
- `src/app/(app)/programs/[id]/courses/` (neu)
- `src/app/(app)/courses/[id]/edit/page.tsx` (neu)
- `src/components/courses/` (neu)

## Notizen
Gleiches Next.js-Slug-Problem wie in T014: `programs/[id]/courses` statt `[programId]`,
da unter `/programs/[id]/` bereits `edit` (T016) existiert und Next.js pro Pfad-Segment
nur einen Slug-Namen erlaubt.

Block-Inhalte werden je `block_type` mit fest verdrahteten Eingabefeldern bearbeitet
(Markdown-Textarea, Front/Back für Flashcards, Frage+Optionen+Korrekt-Radio für Quiz),
nicht generisch aus `schema_definition` abgeleitet — passend zur Konzept-Vorgabe, Phase 2
bewusst mit hartcodierten Course-Types zu bauen; das generische Schema-System kommt erst
in Phase 3 (T026ff). `AddBlockButton` erzeugt Default-Inhalt über die neue
`src/lib/block-defaults.ts`.

Beim Umsetzen wurde eine Inkonsistenz aus T010 gefunden und korrigiert:
`QuizQuestionBlockContent.correctIndex` (camelCase) passte nicht zum tatsächlichen
JSON-Feldnamen `correct_index` aus T012/Konzept — jetzt vereinheitlicht auf `correct_index`.
`getCourseWithBlocks` (T014) liefert jetzt zusätzlich `courseType` mit (additiv, bricht
T014 nicht). `course_types.schema_definition` ist jetzt über
`CourseTypeSchemaDefinition` typisiert statt `unknown`.

Gemeinsame Lösch-Bestätigung aus T016 (`DeleteProgramButton`) in eine wiederverwendbare
`src/components/ui/ConfirmButton.tsx` extrahiert (für Course-/Block-Löschung hier
wiederverwendet); `DeleteProgramButton` entsprechend vereinfacht.

Bug gefunden und behoben: Auf der Kurs-Editor-Seite (Server Component) wurde die
Lösch-Aktion zunächst als `() => deleteCourseAction(...)` an die Client-Komponente
`ConfirmButton` übergeben — das erzeugte zur Laufzeit einen 500er ("Functions cannot be
passed directly to Client Components unless ... 'use server'"), weil Next.js nur echte
Server-Action-Referenzen (oder `.bind()` davon) über die Server/Client-Grenze serialisieren
kann, keine beliebigen Closures. Behoben mit `deleteCourseAction.bind(null, courseId,
programId)` (gleiches Muster wie bei `updateCourseAction`).

End-to-End gegen die laufende Dev-Instanz getestet: Kurs mit Course-Type-Auswahl anlegen,
Quiz-Block per API anlegen und im Editor korrekt rendern lassen, Cascade-Löschung
Program → Courses → Blocks verifiziert. Formular-Submits selbst (Server-Action-Wire-
Protokoll) wie schon in T016 nicht per curl nachstellbar — kein Headless-Browser verfügbar.
