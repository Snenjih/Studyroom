# T018: Course-Type "Markdown-Info" — Renderer + Block-Editor

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T017

## Kontext
Konzept Abschnitt 3 & 10: Erster hartcodierter Course-Type. "Markdown-Info" = statischer
Content, kein User-Input nötig. Execution-Engine: `static` (kein Quiz, kein Code).

## Ziel
Learner können einen Kurs vom Typ "Markdown-Info" aufrufen und Markdown-Blöcke lesen.
Als "abgeschlossen" gilt der Block, wenn er aufgerufen wurde.

## Schritte
- [x] `src/modules/course-types/markdown-info/MarkdownBlock.tsx` — Renderer-Komponente
      (rendert `content.content` als Markdown mit `react-markdown` oder ähnlich)
- [x] `src/modules/course-types/markdown-info/MarkdownEditor.tsx` — Block-Editor für
      Trainer (Textarea mit Markdown-Preview)
- [x] `src/app/(app)/courses/[id]/learn/page.tsx` — Kurs-Lern-Seite (zeigt Blöcke)
- [x] Auto-Complete: Block wird als `done` markiert, wenn die Seite geladen wird
- [x] `src/lib/course-type-registry.ts` — einfaches Registry-Objekt:
      `{ 'markdown-info': { renderer, editor } }`

## Abnahmekriterien
- [x] Markdown-Block rendert Formatierung (Headings, Bold, Listen, Code-Blöcke)
- [x] Block-Status wechselt von `not_started` auf `done` beim Aufrufen
- [x] Editor zeigt Live-Preview beim Eingeben
- [x] Kein Fehler wenn `content` leer ist (leerer Block)

## Betroffene Dateien
- `src/modules/course-types/markdown-info/` (neu)
- `src/app/(app)/courses/[id]/learn/page.tsx` (neu)
- `src/lib/course-type-registry.ts` (neu)

## Notizen
Neue Abhängigkeiten: `react-markdown` (Renderer) und `@tailwindcss/typography`
(Dark-Mode-"prose"-Klassen für Lesetypografie, per `@plugin` in `globals.css` aktiviert,
Tailwind-v4-CSS-first-Konfiguration).

`src/lib/course-type-registry.ts` ist jetzt die zentrale Stelle, über die sowohl die
Lern-Seite (Renderer) als auch der Trainer-Editor (T017s `BlockRow`) den passenden
Block-Editor auflösen — `BlockRow` nutzt den registrierten Editor, sobald einer für den
jeweiligen Course-Type existiert, und fällt sonst auf die in T017 fest verdrahteten
Felder zurück (Rückwärtskompatibilität für flashcard/quiz-question, bis T019/T020 eigene
Registry-Einträge ergänzen).

Da für Lernende noch kein Einschreibungs-Flow existiert (T021 folgt erst später), legt
die Lern-Seite bei Bedarf automatisch eine Einschreibung an (`getOrCreateEnrollment` in
neuem `src/lib/db/enrollments.ts`) und markiert Blöcke bei `execution_engine = 'static'`
serverseitig beim Laden als `done`. Eine neue Server-Action
`src/app/(app)/courses/learn-actions.ts` (`recordBlockProgressAction`) erlaubt Lernenden,
ihren EIGENEN Fortschritt zu schreiben (Eigentümerschaftsprüfung, keine `courses:manage`-
Permission nötig) — wird von T019/T020 für Flashcards/Quiz wiederverwendet; T022 baut die
vollständige Progress-Tracking-API darauf auf.

Zwei Bugs während der Umsetzung gefunden und behoben:
1. Der laufende Dev-Server musste nach `npm install react-markdown
   @tailwindcss/typography` neu gestartet werden (neue node_modules wurden vom
   bereits laufenden Turbopack-Prozess nicht erkannt).
2. `course-type-registry.ts` importierte anfangs `BlockProgressStatus` typisiert aus dem
   Schema-Barrel `@/db/schema` — da diese Datei von Client-Komponenten erreichbar ist,
   zog das den zirkulären Server-Modulgraphen in die Client-Bundle-Analyse hinein und
   ließ den Dev-Server beim ersten Kompilieren von `/courses/[id]/learn` mit 100%+ CPU
   hängen (mehrere Minuten ohne Fortschritt). Behoben, indem `BlockProgressStatus` lokal
   in `course-type-registry.ts` dupliziert wird statt aus dem Schema importiert zu werden.

End-to-End gegen die laufende Dev-Instanz getestet: Markdown-Block (Headings, Bold,
Liste, Code-Block) rendert korrekt auf der Lern-Seite, Block-Progress wechselt beim
Aufruf automatisch auf `done`, Trainer-Editor zeigt die neue Split-View mit Live-Vorschau
statt der alten reinen Textarea aus T017.

**Nachträglich (nach Abschluss-Review durch Subagent) behoben:** `recordBlockProgressAction`
(`src/app/(app)/courses/learn-actions.ts`) prüfte nur, dass die Einschreibung dem
aufrufenden Nutzer gehört, nicht aber, dass die übergebene `blockId` tatsächlich zum Kurs
der Einschreibung gehört. Da Server Actions auch per direktem POST erreichbar sind (nicht
nur über die gerenderte UI), hätte ein Nutzer damit Fortschritt für einen beliebigen Block
aus einem FREMDEN Kurs gegen seine eigene Einschreibung schreiben können. Behoben mit neuer
`blockBelongsToCourse`-Prüfung in `src/lib/db/enrollments.ts`, die gegen `enrollment.courseId`
(nicht den ungeprüft übergebenen `courseId`-Parameter) validiert. Verifiziert: Query liefert
0 Zeilen für einen Block aus einem anderen Kurs, 1 Zeile für den richtigen Kurs.
