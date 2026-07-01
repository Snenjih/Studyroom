# T053: Webhooks (Event-System)

**Phase:** 06-mcp-integration
**Status:** offen
**Abhängig von:** T052

## Kontext
Konzept Abschnitt 9: Webhooks für Automatisierung und Integrationen.
Ereignisse: Kurs abgeschlossen, Einschreibung, neuer User, Block-Submission.

## Ziel
Admins können Webhook-Endpunkte konfigurieren. Bei definierten Ereignissen sendet
die App einen HTTP-POST an den konfigurierten Endpunkt.

## Schritte
- [ ] `src/db/schema/webhooks.ts` — `id`, `org_id`, `url`, `events` (string[]),
      `secret`, `active` (bool), `created_at`
- [ ] Migration generieren und ausführen
- [ ] `src/lib/webhooks/dispatcher.ts` — `dispatchWebhook(event, payload)`:
      sendet POST an alle aktiven Webhooks für dieses Event, HMAC-Signatur im Header
- [ ] Webhook-Events: `course.completed`, `enrollment.created`, `user.created`
- [ ] `src/app/(app)/settings/webhooks/page.tsx` — Webhook-Verwaltung (CRUD)
- [ ] Webhook-Delivery-Log: letzter Status pro Webhook (Erfolg/Fehler) speichern

## Abnahmekriterien
- [ ] Webhook bei `course.completed` wird ausgelöst wenn Kurs abgeschlossen
- [ ] HMAC-Signatur im `X-Studyroom-Signature`-Header
- [ ] Fehlgeschlagene Webhook-Delivery wird im Log sichtbar
- [ ] Webhook kann in Settings deaktiviert werden (ohne Löschen)

## Betroffene Dateien
- `src/db/schema/webhooks.ts` (neu)
- `src/lib/webhooks/dispatcher.ts` (neu)
- `src/app/(app)/settings/webhooks/page.tsx` (neu)

## Notizen
