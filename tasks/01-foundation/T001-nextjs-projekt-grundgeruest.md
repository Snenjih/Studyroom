# T001: Next.js-Projekt-Grundgerüst initialisieren

**Phase:** 01-foundation
**Status:** erledigt
**Abhängig von:** keine

## Kontext
Konzept Abschnitt 7 & 10 (Phase 0): Next.js + TypeScript als festgelegter Tech-Stack.
Monolith-Ansatz: App + API-Routes in einem Next.js-Projekt, kein getrenntes Backend-Package.

## Ziel
Ein lauffähiges Next.js-Projekt mit TypeScript, ESLint, Prettier und einer sinnvollen
Ordnerstruktur existiert. `npm run dev` startet ohne Fehler.

## Schritte
- [x] Next.js-Projekt mit `create-next-app` (App-Router, TypeScript, Tailwind CSS, ESLint) erstellen
- [x] Ordnerstruktur anlegen: `src/app/`, `src/components/`, `src/lib/`, `src/modules/`, `src/db/`
- [x] Prettier einrichten (`.prettierrc`, Format-Script in `package.json`)
- [x] Path-Aliases in `tsconfig.json` konfigurieren (`@/` → `src/`)
- [x] `.gitignore` prüfen/ergänzen (`.env.local`, `node_modules`, `.next`)
- [x] `src/app/page.tsx` als Platzhalter-Startseite (einfaches "Studyroom" Heading)

## Abnahmekriterien
- [x] `npm run dev` startet fehlerfrei auf Port 3000
- [x] `npm run build` erzeugt erfolgreich einen Production-Build
- [x] `npm run lint` gibt keine Fehler aus
- [x] TypeScript-Strict-Mode ist aktiv (`"strict": true` in `tsconfig.json`)

## Betroffene Dateien
- `src/` (neu, gesamte Next.js-Projektstruktur)
- `package.json`, `tsconfig.json`, `.prettierrc`, `.gitignore`

## Notizen
