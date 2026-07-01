# T029: Type-Editor UI — Vorschau-Renderer für Custom-Types

**Phase:** 03-module-system
**Status:** offen
**Abhängig von:** T028

## Kontext
Konzept Abschnitt 3: Zwei-Stufen-System — Schema-Konfiguration (kein Code) für
einfache Typen. Der generische Renderer zeigt Felder basierend auf schema_definition an,
ohne dass ein Custom-Renderer geschrieben werden muss.

## Ziel
Selbst definierte Course-Types können von Learnern genutzt werden, ohne dass ein
Custom-Renderer-Modul nötig ist. Ein generischer Renderer zeigt alle Felder des Schemas.

## Schritte
- [ ] `src/components/course-renderer/GenericBlockRenderer.tsx` — rendert Felder
      dynamisch aus schema_definition (Text → Textanzeige, Markdown → gerendert, etc.)
- [ ] `src/components/course-renderer/GenericBlockEditor.tsx` — generischer Editor
      (passende Input-Felder je nach Feld-Typ)
- [ ] Kurs-Lern-Seite (T018) nutzt Generic-Renderer als Fallback, wenn kein Custom-Renderer
      im AppConfig registriert ist
- [ ] Progress-Regel für Generic-Types: Block gilt als `done` nach erster Interaktion

## Abnahmekriterien
- [ ] Ein über T028 erstellter Custom-Type kann in einem Kurs verwendet werden
- [ ] Learner kann den Generic-Block aufrufen und abschließen
- [ ] Trainer kann Generic-Block über Generic-Editor befüllen
- [ ] Kein Fehler wenn Custom-Type alle unterstützten Feld-Typen enthält

## Betroffene Dateien
- `src/components/course-renderer/GenericBlockRenderer.tsx` (neu)
- `src/components/course-renderer/GenericBlockEditor.tsx` (neu)
- `src/app/(app)/courses/[id]/learn/page.tsx`

## Notizen
