# T018: Course-Type "Markdown-Info" — Renderer + Block-Editor

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T017

## Kontext
Konzept Abschnitt 3 & 10: Erster hartcodierter Course-Type. "Markdown-Info" = statischer
Content, kein User-Input nötig. Execution-Engine: `static` (kein Quiz, kein Code).

## Ziel
Learner können einen Kurs vom Typ "Markdown-Info" aufrufen und Markdown-Blöcke lesen.
Als "abgeschlossen" gilt der Block, wenn er aufgerufen wurde.

## Schritte
- [ ] `src/modules/course-types/markdown-info/MarkdownBlock.tsx` — Renderer-Komponente
      (rendert `content.content` als Markdown mit `react-markdown` oder ähnlich)
- [ ] `src/modules/course-types/markdown-info/MarkdownEditor.tsx` — Block-Editor für
      Trainer (Textarea mit Markdown-Preview)
- [ ] `src/app/(app)/courses/[id]/learn/page.tsx` — Kurs-Lern-Seite (zeigt Blöcke)
- [ ] Auto-Complete: Block wird als `done` markiert, wenn die Seite geladen wird
- [ ] `src/lib/course-type-registry.ts` — einfaches Registry-Objekt:
      `{ 'markdown-info': { renderer, editor } }`

## Abnahmekriterien
- [ ] Markdown-Block rendert Formatierung (Headings, Bold, Listen, Code-Blöcke)
- [ ] Block-Status wechselt von `not_started` auf `done` beim Aufrufen
- [ ] Editor zeigt Live-Preview beim Eingeben
- [ ] Kein Fehler wenn `content` leer ist (leerer Block)

## Betroffene Dateien
- `src/modules/course-types/markdown-info/` (neu)
- `src/app/(app)/courses/[id]/learn/page.tsx` (neu)
- `src/lib/course-type-registry.ts` (neu)

## Notizen
