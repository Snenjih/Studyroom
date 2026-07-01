# T019: Course-Type "Flashcards" — Renderer + Block-Editor

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T018

## Kontext
Konzept Abschnitt 3 & 10: Zweiter hartcodierter Course-Type. Flashcard = Vorderseite/
Rückseite, User flippt die Karte. Execution-Engine: `quiz` (selbstbewertend).

## Ziel
Learner können Flashcard-Blöcke aufrufen, die Karte umdrehen und als "gewusst"/
"nicht gewusst" markieren. Der Block gilt als `done` nach einer Interaktion.

## Schritte
- [x] `src/modules/course-types/flashcards/FlashcardBlock.tsx` — Flip-Animation,
      "Gewusst" / "Nochmal"-Buttons
- [x] `src/modules/course-types/flashcards/FlashcardEditor.tsx` — Trainer-Editor:
      Felder `front` (Vorderseite), `back` (Rückseite)
- [x] Block-Progress: `done` bei "Gewusst" UND bei "Nochmal" (siehe Notizen zum
      Widerspruch mit den Abnahmekriterien)
- [x] `src/lib/course-type-registry.ts` um Flashcard-Typ ergänzen
- [x] `score` in `block_progress` setzen (1.0 für "Gewusst", 0.0 für "Nochmal")

## Abnahmekriterien
- [x] Flip-Animation funktioniert (CSS oder Framer Motion)
- [x] "Gewusst"-Klick setzt Block-Status auf `done`, score = 1.0
- [x] "Nochmal"-Klick setzt Block-Status auf `done`, score = 0.0 (trotzdem abgeschlossen)
- [x] Editor zeigt Front/Back als separate Eingabefelder

## Betroffene Dateien
- `src/modules/course-types/flashcards/` (neu)
- `src/lib/course-type-registry.ts`

## Notizen
Widerspruch im Task-Text selbst: "Schritte" nennt `failed` bei "Nochmal", die
Abnahmekriterien verlangen aber `done` mit `score = 0.0` in BEIDEN Fällen ("trotzdem
abgeschlossen"). Da Abnahmekriterien das eigentliche Prüfkriterium sind, wurde danach
implementiert — beide Antworten setzen `status = 'done'`, nur der `score` unterscheidet
sich (1.0 vs. 0.0).

Flip nutzt reines CSS (3D-Transform mit `perspective`/`preserve-3d`/`backface-visibility`,
Tailwind-Arbitrary-Values), kein Framer Motion nötig. Klick-Fläche ist ein
`role="button"`-`div` statt eines echten `<button>`, da darin verschachtelt noch die
"Gewusst"/"Nochmal"-Buttons liegen (kein `<button>` in `<button>`, ungültiges HTML).
Renderer/Editor nutzen die in T018 eingeführte `BlockRendererProps`/`BlockEditorProps`-
Schnittstelle aus `course-type-registry.ts` unverändert.

End-to-End getestet: Flashcard-Kurs anlegen, Block per API erzeugen, Lern-Seite zeigt
Vorderseite + "Klicken zum Umdrehen" (200 OK), kein Auto-Complete (execution_engine
`quiz`, anders als Markdown-Info), Trainer-Editor zeigt registrierte
Front/Back-Split-Felder. Die eigentliche Klick-Interaktion (Flip, Gewusst/Nochmal) lässt
sich ohne Headless-Browser nicht auslösen — das zugrunde liegende Schreiben von
`status='done'`/`score=1` in `block_progress` wurde direkt per SQL gegen dieselbe
Tabellenstruktur verifiziert, die `upsertBlockProgress` (T018) auch beim Markdown-
Auto-Complete erfolgreich genutzt hat.
