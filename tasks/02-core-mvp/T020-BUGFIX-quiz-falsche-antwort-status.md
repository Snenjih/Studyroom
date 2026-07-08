# T020-BUGFIX: Quiz zählt falsche Antwort trotzdem als abgeschlossen

**Phase:** 02-core-mvp (Bugfix zu T020)
**Status:** offen
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
- [ ] `status: isCorrect ? 'done' : 'failed'` in `QuizBlock.tsx` setzen
- [ ] Prüfen, ob die UI für den Fall `status === 'failed'` (erneuter Versuch erlaubt? oder
      endgültig gesperrt wie aktuell bei `submitted`?) ein bewusstes Verhalten braucht —
      aktuell sperrt `submitted`-State die Frage nach der ersten Abgabe komplett, auch bei
      falscher Antwort. Klären, ob das so bleiben soll oder ob `failed` einen Retry erlauben
      muss (Konzept trifft dazu keine explizite Aussage — Rücksprache mit Nutzer, falls
      unklar).
- [ ] Bestehende Submission (falls vorhanden) beim Laden korrekt als `failed` erkennen
      (`getPreviousSelection`/`submitted`-Logik prüft aktuell nur auf Vorhandensein einer
      Selection, nicht auf Status — vermutlich unkritisch, aber gegenprüfen)
- [ ] Regressionstest: Kurs mit Quiz-Frage anlegen, falsch beantworten, `block_progress.status`
      und `enrollments.status` in der DB prüfen (muss `failed` / weiterhin `active` sein)
- [ ] Gegenprobe: richtige Antwort weiterhin `done` / Kurs wird bei 100% `done` korrekt
      `completed`

## Abnahmekriterien
- [ ] Falsche Quiz-Antwort → `block_progress.status = 'failed'`
- [ ] Kurs mit falsch beantworteter Pflichtfrage wird NICHT als `completed` markiert
- [ ] Richtige Quiz-Antwort weiterhin `done`, Kurs-Completion-Logik unverändert korrekt

## Betroffene Dateien
- `src/modules/course-types/quiz/QuizBlock.tsx`

## Notizen
Gefunden während interaktivem Playwright-MCP-Test (Login → Program "Mathe" → Course
"Trigonometrie-Quiz" → falsche Antwort "180°" bei Frage "Wie viel Grad hat ein rechter
Winkel?"). Testdaten (Program "Mathe", diverse Test-Courses) liegen aktuell noch in der
lokalen Dev-DB, nicht Teil dieser Task.
