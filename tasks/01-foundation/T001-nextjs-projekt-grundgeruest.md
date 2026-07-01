# T001: Next.js-Projekt-Grundgerüst initialisieren

**Phase:** 01-foundation
**Status:** offen
**Abhängig von:** keine

## Kontext
Konzept Abschnitt 7 & 10 (Phase 0): Next.js + TypeScript als festgelegter Tech-Stack.
Monolith-Ansatz: App + API-Routes in einem Next.js-Projekt, kein getrenntes Backend-Package.

## Ziel
Ein lauffähiges Next.js-Projekt mit TypeScript, ESLint, Prettier und einer sinnvollen
Ordnerstruktur existiert. `npm run dev` startet ohne Fehler.

## Schritte
- [ ] Next.js-Projekt mit `create-next-app` (App-Router, TypeScript, Tailwind CSS, ESLint) erstellen
- [ ] Ordnerstruktur anlegen: `src/app/`, `src/components/`, `src/lib/`, `src/modules/`, `src/db/`
- [ ] Prettier einrichten (`.prettierrc`, Format-Script in `package.json`)
- [ ] Path-Aliases in `tsconfig.json` konfigurieren (`@/` → `src/`)
- [ ] `.gitignore` prüfen/ergänzen (`.env.local`, `node_modules`, `.next`)
- [ ] `src/app/page.tsx` als Platzhalter-Startseite (einfaches "Studyroom" Heading)

## Abnahmekriterien
- [ ] `npm run dev` startet fehlerfrei auf Port 3000
- [ ] `npm run build` erzeugt erfolgreich einen Production-Build
- [ ] `npm run lint` gibt keine Fehler aus
- [ ] TypeScript-Strict-Mode ist aktiv (`"strict": true` in `tsconfig.json`)

## Betroffene Dateien
- `src/` (neu, gesamte Next.js-Projektstruktur)
- `package.json`, `tsconfig.json`, `.prettierrc`, `.gitignore`

## Notizen
