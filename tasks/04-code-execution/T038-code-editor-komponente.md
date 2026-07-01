# T038: Code-Editor-Komponente im Frontend

**Phase:** 04-code-execution
**Status:** offen
**Abhängig von:** T037

## Kontext
Konzept Abschnitt 10 (Phase 3): Code-Editor für die Softwareentwicklungs-Aufgaben.
Braucht Syntax-Highlighting und eine gute DX für Learner.

## Ziel
Ein vollwertiger Code-Editor mit Syntax-Highlighting ist in die Kurs-Lern-Seite
eingebettet. Der Editor unterstützt die konfigurierten Programmiersprachen.

## Schritte
- [ ] `@uiw/react-codemirror` oder `@monaco-editor/react` installieren
      (CodeMirror bevorzugt: leichter, SSR-freundlicher)
- [ ] `src/components/editor/CodeEditor.tsx` — Wrapper-Komponente:
      Props: `value`, `onChange`, `language`, `readOnly?`
- [ ] Sprach-Support: Python, JavaScript, Java (CodeMirror Language-Packages)
- [ ] Dark-Mode-Theme passend zur App-Designsprache
- [ ] Tastaturkürzel: Tab für Einrückung, kein Browser-Tab-Focus-Trap
- [ ] Lazy-Loading (dynamic import) — Editor-Bundle nicht im Initial-Load

## Abnahmekriterien
- [ ] Editor zeigt Syntax-Highlighting für Python/JS/Java
- [ ] Tab-Taste fügt Einrückung ein (kein Fokus-Verlust)
- [ ] Editor ist im Dark-Mode gut lesbar
- [ ] Performance: Initial-Load der Seite bleibt < 2s (Lazy-Loading greift)

## Betroffene Dateien
- `src/components/editor/CodeEditor.tsx` (neu)
- `src/modules/course-types/software-dev/SoftwareDevBlock.tsx`

## Notizen
