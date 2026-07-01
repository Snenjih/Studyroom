# T051: MCP-Server — Einschreibungen und User-Daten als Tools

**Phase:** 06-mcp-integration
**Status:** offen
**Abhängig von:** T050

## Kontext
Konzept Abschnitt 9: MCP-Server für Einschreibungsverwaltung und User-Abfragen.
KI-Assistent soll Einschreibungen anlegen können (z.B. "Schreibe User X in Kurs Y ein").

## Ziel
Ein KI-Assistent kann über MCP Einschreibungen anlegen/abfragen und Nutzerinformationen
lesen. Schreibende Operationen erfordern erhöhte Berechtigungen.

## Schritte
- [ ] `src/mcp/tools/enroll-user.ts` — Tool: Einschreibung anlegen (erfordert `enrollments:manage`)
- [ ] `src/mcp/tools/list-enrollments.ts` — Tool: Einschreibungen eines Kurses
- [ ] `src/mcp/tools/get-user.ts` — Tool: User-Info (Name, Rollen; kein Passwort-Hash!)
- [ ] `src/mcp/tools/list-users.ts` — Tool: User der Org (paginiert)
- [ ] Permission-Checks für jeden Tool-Aufruf basierend auf API-Key-User
- [ ] Datenschutz: sensible Felder (password_hash, E-Mail optional maskiert) im Output filtern

## Abnahmekriterien
- [ ] `enroll-user` legt Einschreibung an (403 ohne Permission)
- [ ] `get-user` gibt niemals `password_hash` zurück
- [ ] `list-users` ist paginiert (max. 50 pro Seite)
- [ ] Permission-Fehler im MCP-Tool-Response klar formuliert

## Betroffene Dateien
- `src/mcp/tools/enroll-user.ts`, `list-enrollments.ts`, `get-user.ts`, `list-users.ts` (neu)

## Notizen
