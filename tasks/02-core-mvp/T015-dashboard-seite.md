# T015: Dashboard-Seite (Übersicht eigener/zugewiesener Kurse)

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T014

## Kontext
Konzept Abschnitt 10 (Phase 1): "Home Dashboard — eigene + zugewiesene Kurse,
Fortschrittsübersicht." Erstes UI nach dem Login.

## Ziel
Nach dem Login landet der Benutzer auf einem Dashboard, das seine eingeschriebenen
Kurse mit Fortschrittsanzeige und (für Trainer) zugewiesene Programme zeigt.

## Schritte
- [ ] `src/app/(app)/dashboard/page.tsx` — Server-Component, lädt Daten direkt
- [ ] Eingeschriebene Kurse des Learners mit Fortschrittsbalken (%)
- [ ] Für Trainer: Liste der Programme, in denen sie Kurse verwalten
- [ ] `src/components/dashboard/CourseCard.tsx` — Kurs-Kachel mit Fortschrittsbalken
- [ ] `src/components/dashboard/ProgressBar.tsx` — wiederverwendbare Fortschrittsanzeige
- [ ] Navigationsleiste (Sidebar oder Topbar) mit Links zu Programs, Settings
- [ ] Leerer Zustand ("Noch keine Kurse — jetzt einschreiben")

## Abnahmekriterien
- [ ] Learner sieht seine eingeschriebenen Kurse mit Fortschritt 0–100%
- [ ] Trainer/Admin sieht zugewiesene Programme
- [ ] Seite lädt ohne Client-seitiges Fetching (Server-Component)
- [ ] Leerer Zustand wird angezeigt wenn keine Einschreibungen vorhanden

## Betroffene Dateien
- `src/app/(app)/dashboard/page.tsx` (neu)
- `src/components/dashboard/CourseCard.tsx`, `ProgressBar.tsx` (neu)
- `src/components/layout/Sidebar.tsx` oder `Topbar.tsx` (neu)

## Notizen
