# T015: Dashboard-Seite (Übersicht eigener/zugewiesener Kurse)

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T014

## Kontext
Konzept Abschnitt 10 (Phase 1): "Home Dashboard — eigene + zugewiesene Kurse,
Fortschrittsübersicht." Erstes UI nach dem Login.

## Ziel
Nach dem Login landet der Benutzer auf einem Dashboard, das seine eingeschriebenen
Kurse mit Fortschrittsanzeige und (für Trainer) zugewiesene Programme zeigt.

## Schritte
- [x] `src/app/(app)/dashboard/page.tsx` — Server-Component, lädt Daten direkt
- [x] Eingeschriebene Kurse des Learners mit Fortschrittsbalken (%)
- [x] Für Trainer: Liste der Programme, in denen sie Kurse verwalten
- [x] `src/components/dashboard/CourseCard.tsx` — Kurs-Kachel mit Fortschrittsbalken
- [x] `src/components/dashboard/ProgressBar.tsx` — wiederverwendbare Fortschrittsanzeige
- [x] Navigationsleiste (Sidebar oder Topbar) mit Links zu Programs, Settings
- [x] Leerer Zustand ("Noch keine Kurse — jetzt einschreiben")

## Abnahmekriterien
- [x] Learner sieht seine eingeschriebenen Kurse mit Fortschritt 0–100%
- [x] Trainer/Admin sieht zugewiesene Programme
- [x] Seite lädt ohne Client-seitiges Fetching (Server-Component)
- [x] Leerer Zustand wird angezeigt wenn keine Einschreibungen vorhanden

## Betroffene Dateien
- `src/app/(app)/dashboard/page.tsx` (neu)
- `src/components/dashboard/CourseCard.tsx`, `ProgressBar.tsx` (neu)
- `src/components/layout/Sidebar.tsx` oder `Topbar.tsx` (neu)

## Notizen
Design mit dem `frontend-design`-Skill erarbeitet (Nutzer-CLAUDE.md verlangt das für
Frontend-Arbeit): dunkles Terminal-Thema mit Electric-Aqua-Akzent (passend zur im
Konzept erwähnten bestehenden "Dark-Terminal/Electric-Aqua"-Design-Sprache), Mono-Font
für Navigation/Labels. `src/app/(app)/layout.tsx` neu als Route-Group-Layout mit Sidebar.
`src/app/page.tsx` leitet jetzt auf `/dashboard` um, `src/proxy.ts` leitet nach Login
ebenfalls direkt auf `/dashboard` (vorher `/`) — der alte Platzhalter-Root wurde ersetzt.
Trainer/Admin-Erkennung: MVP-Vereinfachung, zeigt bei `programs:manage`-Permission alle
Programme der Org (echte Program-Scope-Zuweisung ist erst mit dem ABAC-Ausbau in
Konzept Abschnitt 8 vorgesehen). Fortschrittsberechnung nutzt zwei aggregierte Queries
statt einer Query pro Kurs (kein N+1). End-to-End über HTML-Ausgabe der laufenden
Dev-Instanz verifiziert (Leerzustände, Sidebar-Navigation, Logout-Form); kein Headless-
Browser für Screenshot verfügbar.
