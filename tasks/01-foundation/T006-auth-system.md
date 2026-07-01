# T006: Auth-System einrichten (Login, Sessions)

**Phase:** 01-foundation
**Status:** offen
**Abhängig von:** T005

## Kontext
Konzept Abschnitt 10 (Phase 0): Login und Sessions als Teil des Fundaments. Standard-Auth,
kein OAuth für den Start — E-Mail/Passwort reicht für den Self-Hosted-Fall.

## Ziel
Benutzer können sich mit E-Mail und Passwort einloggen, eine Session wird angelegt, und
geschützte Seiten sind ohne Login nicht erreichbar.

## Schritte
- [ ] Auth-Library installieren (NextAuth.js v5 / Auth.js mit Credentials-Provider)
- [ ] `src/lib/auth.ts` — NextAuth-Konfiguration (Credentials-Provider, Session-Strategy)
- [ ] Passwort-Hashing mit `bcryptjs` beim Registrieren/Seed
- [ ] `src/app/api/auth/[...nextauth]/route.ts` — Auth-API-Route
- [ ] Login-Seite `src/app/(auth)/login/page.tsx` (E-Mail + Passwort Formular)
- [ ] Auth-Middleware `src/middleware.ts` — schützt alle Routen außer `/login`
- [ ] `src/lib/session.ts` — Helper: `getSession()`, `requireSession()`

## Abnahmekriterien
- [ ] Login mit korrekten Credentials funktioniert, Session wird gesetzt
- [ ] Login mit falschen Credentials gibt Fehlermeldung
- [ ] Aufruf einer geschützten Route ohne Session → Redirect auf `/login`
- [ ] Logout löscht die Session

## Betroffene Dateien
- `src/lib/auth.ts`, `src/lib/session.ts` (neu)
- `src/app/(auth)/login/page.tsx` (neu)
- `src/app/api/auth/[...nextauth]/route.ts` (neu)
- `src/middleware.ts` (neu)

## Notizen
