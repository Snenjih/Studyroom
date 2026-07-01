# T049: MCP-Server — Grundgerüst

**Phase:** 06-mcp-integration
**Status:** offen
**Abhängig von:** T048

## Kontext
Konzept Abschnitt 9: "Instanz exponiert einen MCP-Server (wie ClassroomIO mit
@classroomio/mcp) — externe KI-Assistenten können Kurse, Fortschritt, Einschreibungen
abfragen/verwalten." Richtung 1 von 2.

## Ziel
Ein MCP-Server läuft als Teil der App und exponiert Tools für externe KI-Clients
(z.B. Claude). Auth via API-Key.

## Schritte
- [ ] `@modelcontextprotocol/sdk` installieren
- [ ] `src/mcp/server.ts` — MCP-Server-Initialisierung (SSE oder stdio-Transport)
- [ ] `src/mcp/auth.ts` — API-Key-Authentifizierung für MCP-Requests
- [ ] `src/app/api/mcp/route.ts` — HTTP-Endpoint für MCP-Transport (SSE)
- [ ] `src/db/schema/api-keys.ts` — `id`, `user_id`, `key_hash`, `name`, `created_at`
- [ ] API-Key-Verwaltung in Settings: Schlüssel anlegen und widerrufen

## Abnahmekriterien
- [ ] MCP-Server antwortet auf `initialize`-Request
- [ ] Unauthentifizierter Request wird abgelehnt (401)
- [ ] API-Keys können in Settings angelegt und widerrufen werden
- [ ] MCP-Server läuft im gleichen Docker-Container wie die App

## Betroffene Dateien
- `src/mcp/server.ts`, `src/mcp/auth.ts` (neu)
- `src/app/api/mcp/route.ts` (neu)
- `src/db/schema/api-keys.ts` (neu)

## Notizen
