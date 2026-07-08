# T020-BUGFIX: Quiz zählt falsche Antwort trotzdem als abgeschlossen

**Phase:** 02-core-mvp (Bugfix zu T020)
**Status:** erledigt (2026-07-08)
**Priorität:** 🔴 HÖCHSTE PRIORITÄT — vor allen anderen offenen Tasks bearbeiten
**Abhängig von:** keine

## Kontext
Beim interaktiven End-to-End-Testen (Playwright-MCP: Login → Program → Course → Quiz
beantworten) gefunden. Konzept/Schema (`docs/CONCEPT.md` Abschnitt 4, `block_progress.status`)
sieht explizit `not_started | in_progress | done | failed` vor. T022 (Progress-Tracking-API)
zählt bei der Kurs-Completion-Regel bewusst NUR `done`-Blöcke, `failed` zählt NICHT als
abgeschlossen (siehe Notizen in `tasks/02-core-mvp/T022-progress-tracking-api.md`).

## Ziel
Eine falsch beantwortete Quiz-Frage setzt `block_progress.status` auf `failed`, nicht auf
`done`. Ein Kurs mit einer falsch beantworteten Pflichtfrage gilt dadurch korrekt NICHT als
abgeschlossen (`enrollments.status` bleibt `active`, `completed_at` bleibt leer).

## Fehlerbeschreibung (reproduziert)
In `src/modules/course-types/quiz/QuizBlock.tsx`, Funktion `handleSubmit` (Zeile 37-48):

```ts
function handleSubmit() {
  if (selected === null) return;
  setSubmitted(true);
  const isCorrect = selected === correctIndex;
  startTransition(() =>
    onComplete({
      status: 'done',              // <-- IMMER 'done', unabhängig von isCorrect
      score: isCorrect ? 1 : 0,
      submissionData: { selected_index: selected },
    }),
  );
}
```

`status` ist hart auf `'done'` gesetzt, unabhängig davon ob `isCorrect` `true` oder `false`
ist — nur `score` unterscheidet richtig/falsch. Live gegen echte DB verifiziert: nach einer
falsch beantworteten Frage stand `block_progress.status = 'done'`, `score = 0`, UND
`enrollments.status = 'completed'` — der Kurs galt also fälschlich als abgeschlossen, obwohl
die einzige Frage falsch beantwortet wurde.

## Schritte
- [x] `status: isCorrect ? 'done' : 'failed'` in `QuizBlock.tsx` setzen
- [x] Entscheidung zum Retry-Verhalten: **kein Retry** — Frage bleibt nach der ersten Abgabe
      gesperrt (`submitted`-State), unabhängig davon ob `done` oder `failed`. Bewusst
      minimal gehalten, kein Scope-Creep über den reinen Status-Bug hinaus; siehe Notizen.
- [x] Bestehende Submission beim Laden: `submitted`/`getPreviousSelection` hängt nur an
      Vorhandensein einer `selected_index`-Selection, nicht am Status — unverändert korrekt,
      keine Anpassung nötig.
- [x] Regressionstest: Testkurs mit Quiz-Frage angelegt, falsch beantwortet — DB bestätigt
      `block_progress.status = 'failed'`, `enrollments.status = 'active'`, `completed_at`
      leer.
- [x] Gegenprobe: zweiter Testkurs, richtig beantwortet — DB bestätigt
      `block_progress.status = 'done'`, `enrollments.status = 'completed'`, `completed_at`
      gesetzt.

## Abnahmekriterien
- [x] Falsche Quiz-Antwort → `block_progress.status = 'failed'`
- [x] Kurs mit falsch beantworteter Pflichtfrage wird NICHT als `completed` markiert
- [x] Richtige Quiz-Antwort weiterhin `done`, Kurs-Completion-Logik unverändert korrekt

## Betroffene Dateien
- `src/modules/course-types/quiz/QuizBlock.tsx`

## Notizen
Gefunden während interaktivem Playwright-MCP-Test (Login → Program "Mathe" → Course
"Trigonometrie-Quiz" → falsche Antwort "180°" bei Frage "Wie viel Grad hat ein rechter
Winkel?").

Fix: Ein-Zeilen-Änderung in `handleSubmit()` — `status` hängt jetzt von `isCorrect` ab statt
hart auf `'done'` zu stehen. `npx tsc --noEmit` und `npx eslint` sauber.

Live gegen echte Postgres-Instanz verifiziert (zwei frische Testkurse, je eine Quiz-Frage):
falsch beantwortet → `failed`/`active`/kein `completed_at`; richtig beantwortet →
`done`/`completed`/`completed_at` gesetzt. Alle Testdaten (Program "Mathe" inkl. aller
Test-Courses) anschließend aus der lokalen Dev-DB gelöscht (Cascade-Delete über
`programs.id`).
