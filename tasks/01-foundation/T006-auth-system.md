# T006: Auth-System einrichten (Login, Sessions)

**Phase:** 01-foundation
**Status:** erledigt (2026-07-01)
**Abhängig von:** T005

## Kontext
Konzept Abschnitt 10 (Phase 0): Login und Sessions als Teil des Fundaments. Standard-Auth,
kein OAuth für den Start — E-Mail/Passwort reicht für den Self-Hosted-Fall.

## Ziel
Benutzer können sich mit E-Mail und Passwort einloggen, eine Session wird angelegt, und
geschützte Seiten sind ohne Login nicht erreichbar.

## Schritte
- [x] Auth-Library installieren — **Abweichung:** `jose` + `bcryptjs` statt NextAuth.js
      v5, siehe Notizen
- [x] `src/lib/auth.ts` — Credential-Verifikation (bcrypt-Vergleich gegen `users`-Tabelle)
- [x] Passwort-Hashing mit `bcryptjs` (`hashPassword()`, wird von T008 für den Seed genutzt)
- [x] ~~`src/app/api/auth/[...nextauth]/route.ts`~~ entfällt, siehe Notizen
- [x] Login-Seite `src/app/(auth)/login/page.tsx` (E-Mail + Passwort Formular)
- [x] Auth-Proxy `src/proxy.ts` (Next.js 16: `middleware.ts` → `proxy.ts`) — schützt alle
      Routen außer `/login`
- [x] `src/lib/session.ts` — Helper: `getSession()`, `requireSession()`, `createSession()`,
      `deleteSession()`

## Abnahmekriterien
- [x] Login mit korrekten Credentials funktioniert, Session wird gesetzt
- [x] Login mit falschen Credentials gibt Fehlermeldung
- [x] Aufruf einer geschützten Route ohne Session → Redirect auf `/login`
- [x] Logout löscht die Session

## Betroffene Dateien
- `src/lib/auth.ts`, `src/lib/session.ts` (neu)
- `src/app/(auth)/login/page.tsx`, `src/app/(auth)/login/actions.ts` (neu)
- `src/proxy.ts` (neu, statt `src/middleware.ts`)
- `src/app/actions.ts` (neu, Logout-Server-Action)
- `src/app/page.tsx` (angepasst — geschützte Beispielseite mit Logout-Button, damit der
  Flow überhaupt end-to-end testbar ist)
- `.env.local`, `.env.example` (`NEXTAUTH_URL`/`NEXTAUTH_SECRET` → `SESSION_SECRET`)

## Notizen
- **Abweichung von der Task-Vorgabe (NextAuth.js v5):** Stattdessen eigene, schlanke
  Session-Lösung mit `jose` (JWT, httpOnly-Cookie) + `bcryptjs`, exakt nach dem in den
  Next.js-16-Docs selbst empfohlenen Pattern (`node_modules/next/dist/docs/01-app/
  02-guides/authentication.md`, Abschnitt „Stateless Sessions"). Gründe:
  1. `CLAUDE.md` legt nur Next.js/TS/Postgres/Drizzle fest — NextAuth war nur ein
     Vorschlag im Task-Text, keine Konzept-Vorgabe.
  2. next-auth v5 ("Auth.js") ist seit Jahren im Beta-Status (aktuell `5.0.0-beta.31`);
     unnötiges Beta-Abhängigkeitsrisiko für ein zentrales Sicherheitsfeature.
  3. Eigene Lösung ist deutlich schlanker (passt zum Self-Hosting-Minimalismus des
     Projekts) und hat kein Adapter-Schema, das mit unserem eigenen `users`-Schema aus
     T004 kollidieren könnte.
  - Damit entfällt auch `src/app/api/auth/[...nextauth]/route.ts` — es gibt keine
    NextAuth-API-Route, Login läuft über eine Server Action (`src/app/(auth)/login/
    actions.ts`).
- **Next.js 16 Breaking Change:** `middleware.ts` wurde in `proxy.ts` umbenannt (Datei
  UND Funktionsname). Laut Upgrade-Guide läuft `proxy` außerdem nicht mehr im Edge-,
  sondern im Node.js-Runtime — relevant, falls später doch mal Node-only-Auth-Code im
  Proxy landen soll. Quelle: `node_modules/next/dist/docs/01-app/02-guides/upgrading/
  version-16.md`. AGENTS.md im Projekt weist explizit darauf hin, vor Next.js-Code die
  gebündelten Docs zu prüfen, da Trainingsdaten hier veraltet sind.
- Session-Payload enthält nur `userId` + `orgId` (keine PII), signiert mit HS256, 7 Tage
  Gültigkeit — deckt sich mit der offiziellen Empfehlung.
- Cookie `secure`-Flag ist an `NODE_ENV === 'production'` gekoppelt statt hart auf `true`,
  damit lokale Entwicklung ohne TLS funktioniert (Self-Hosting läuft ggf. ohne HTTPS
  hinter einem eigenen Reverse-Proxy).
- Alle vier Abnahmekriterien real per Browser (Playwright/Chromium, temporär installiert)
  gegen einen laufenden `next dev` + lokale Postgres-Instanz verifiziert: falsches
  Passwort → Fehlermeldung + kein Cookie; korrektes Passwort → httpOnly-Session-Cookie +
  Redirect; geschützte Route ohne Cookie → Redirect auf `/login`; Logout → Cookie
  entfernt + Redirect, Route danach wieder gesperrt. Postgres/Dev-Server/Playwright nach
  Verifikation wieder gestoppt bzw. nicht Teil des Commits.
