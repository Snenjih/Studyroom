# T019: Course-Type "Flashcards" — Renderer + Block-Editor

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T018

## Kontext
Konzept Abschnitt 3 & 10: Zweiter hartcodierter Course-Type. Flashcard = Vorderseite/
Rückseite, User flippt die Karte. Execution-Engine: `quiz` (selbstbewertend).

## Ziel
Learner können Flashcard-Blöcke aufrufen, die Karte umdrehen und als "gewusst"/
"nicht gewusst" markieren. Der Block gilt als `done` nach einer Interaktion.

## Schritte
- [ ] `src/modules/course-types/flashcards/FlashcardBlock.tsx` — Flip-Animation,
      "Gewusst" / "Nochmal"-Buttons
- [ ] `src/modules/course-types/flashcards/FlashcardEditor.tsx` — Trainer-Editor:
      Felder `front` (Vorderseite), `back` (Rückseite)
- [ ] Block-Progress: `done` bei "Gewusst", `failed` bei "Nochmal" (beide markieren Block)
- [ ] `src/lib/course-type-registry.ts` um Flashcard-Typ ergänzen
- [ ] `score` in `block_progress` setzen (1.0 für "Gewusst", 0.0 für "Nochmal")

## Abnahmekriterien
- [ ] Flip-Animation funktioniert (CSS oder Framer Motion)
- [ ] "Gewusst"-Klick setzt Block-Status auf `done`, score = 1.0
- [ ] "Nochmal"-Klick setzt Block-Status auf `done`, score = 0.0 (trotzdem abgeschlossen)
- [ ] Editor zeigt Front/Back als separate Eingabefelder

## Betroffene Dateien
- `src/modules/course-types/flashcards/` (neu)
- `src/lib/course-type-registry.ts`

## Notizen
