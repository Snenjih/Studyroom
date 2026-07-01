# T052: REST-API — OpenAPI-Spezifikation einrichten

**Phase:** 06-mcp-integration
**Status:** offen
**Abhängig von:** T051

## Kontext
Konzept Abschnitt 9: "REST/GraphQL-API + Webhooks — für Automatisierung und spätere
Integrationen, macht die App für andere Tools anschlussfähig."

## Ziel
Eine OpenAPI-Spezifikation für die öffentliche REST-API existiert und ist unter
`/api/docs` als Swagger-UI abrufbar.

## Schritte
- [ ] `@asteasolutions/zod-to-openapi` oder `swagger-jsdoc` installieren
- [ ] `src/lib/openapi.ts` — OpenAPI-Dokument-Generator (aus bestehenden Zod-Schemas)
- [ ] `src/app/api/docs/route.ts` — gibt OpenAPI-JSON zurück
- [ ] `src/app/(public)/api-docs/page.tsx` — Swagger-UI-Seite (öffentlich zugänglich)
- [ ] Bestehende Zod-Schemas (T013, T014) mit OpenAPI-Metadaten annotieren
- [ ] Auth: Bearer-Token-Beschreibung in OpenAPI-Spec

## Abnahmekriterien
- [ ] `GET /api/docs` gibt valides OpenAPI 3.0-JSON zurück
- [ ] Swagger-UI zeigt alle dokumentierten Endpoints
- [ ] Alle Request/Response-Bodies sind in der Spec beschrieben
- [ ] Auth-Schema (Bearer Token) ist in der Spec dokumentiert

## Betroffene Dateien
- `src/lib/openapi.ts` (neu)
- `src/app/api/docs/route.ts` (neu)
- `src/app/(public)/api-docs/page.tsx` (neu)

## Notizen
