# T000: Vollständigen Task-Breakdown generieren

**Phase:** 00-bootstrap
**Status:** erledigt (2026-07-01)
**Abhängig von:** keine

## Kontext
`docs/CONCEPT.md`, Abschnitt 10 ("Realistische Roadmap") beschreibt 7 Phasen (0-6 im
Konzept, hier als Ordner 01-foundation bis 07-self-hosting-reife abgebildet). Diese Task
übersetzt die Roadmap in konkrete, einzeln abarbeitbare Task-Dateien.

## Ziel
Für jede Phase existieren granulare Task-Dateien (Zielgröße: **50+ Tasks insgesamt**, jede
so klein geschnitten, dass sie in einer fokussierten Session vollständig umsetzbar ist —
z.B. "Drizzle-Schema für users/roles/permissions anlegen" statt "Auth-System bauen").
`tasks/progress.md` listet danach alle Tasks vollständig auf.

## Schritte
- [ ] `docs/CONCEPT.md` vollständig lesen, insbesondere Abschnitte 2-10
- [ ] Für jede Phase (01-foundation ... 07-self-hosting-reife) aus Abschnitt 10 des Konzepts
      die grob beschriebenen Punkte in einzelne, kleine Tasks zerlegen. Faustregel: lieber
      mehr kleine Tasks als wenige große — jede Task sollte einen einzelnen, klar
      abgrenzbaren Baustein liefern (eine Migration, ein Endpoint, eine UI-Komponente inkl.
      Anbindung, ein Modul-Grundgerüst, ein Testfall-Set, ...).
- [ ] Jede Task bekommt eine global fortlaufende ID (T001, T002, ...) in der Reihenfolge,
      in der sie sinnvollerweise umgesetzt werden (Abhängigkeiten beachten).
- [ ] Jede Task-Datei nach `tasks/TASK_TEMPLATE.md` anlegen, im passenden Phasen-Ordner
      unter `tasks/<phase>/T0xx-kurzer-slug.md`.
- [ ] Abhängigkeiten zwischen Tasks (Feld "Abhängig von") korrekt eintragen — insbesondere:
      Phase 02 (Core MVP) braucht ein fertiges Phase 01 (Fundament); Phase 03
      (Modul-System) braucht funktionierende Course-Types aus Phase 02; Phase 04
      (Code-Execution) braucht das Modul-System aus Phase 03.
- [ ] Bewusst mit **hartcodierten** Course-Types in Phase 02 planen (Markdown-Info,
      Flashcards, einfaches Quiz), erst in Phase 03 zum generischen Schema-System
      umbauen — genau wie in Konzept Abschnitt 10 als "wichtigster Rat" festgehalten.
- [ ] `tasks/progress.md` komplett neu schreiben: Gesamtübersicht mit allen Phasen, allen
      Task-Titeln, Status-Checkboxen, und einem Zeiger "Nächste Task" ganz oben.
- [ ] Kurz prüfen: sind es tatsächlich 50+ Tasks über alle Phasen? Falls eine Phase deutlich
      dünner ausfällt als die anderen, nochmal genauer zerlegen.

## Abnahmekriterien
- [ ] Jede der 7 Phasen hat mindestens 5-6 konkrete Task-Dateien, insgesamt 50+ Tasks
- [ ] Jede Task-Datei folgt exakt `tasks/TASK_TEMPLATE.md` und ist inhaltlich vollständig
      ausgefüllt (kein Platzhaltertext mehr)
- [ ] `tasks/progress.md` spiegelt alle erzeugten Tasks korrekt wider
- [ ] Keine Anwendungscode-Datei wurde angelegt oder verändert — diese Task plant nur
- [ ] Abhängigkeiten zwischen Tasks sind konsistent (keine Task hängt von einer späteren ab)

## Betroffene Dateien
- `tasks/01-foundation/*.md` bis `tasks/07-self-hosting-reife/*.md` (neu)
- `tasks/progress.md` (überschrieben)

## Notizen
(wird während der Bearbeitung ergänzt)
