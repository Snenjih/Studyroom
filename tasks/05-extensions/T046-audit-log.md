# T046: Audit-Log

**Phase:** 05-extensions
**Status:** offen
**Abhängig von:** T045

## Kontext
Konzept Abschnitt 9: "Audit-Log — bei granularen Permissions unverzichtbar, um
nachzuvollziehen wer was geändert hat."

## Ziel
Alle relevanten Änderungen (Kurs erstellt/gelöscht, Einschreibung, Rollen-Änderung)
werden in einem Audit-Log gespeichert und sind für Admins einsehbar.

## Schritte
- [ ] `src/db/schema/audit-log.ts` — `id`, `org_id`, `user_id`, `action` (string),
      `entity_type`, `entity_id`, `old_value JSONB`, `new_value JSONB`, `created_at`
- [ ] Migration generieren und ausführen
- [ ] `src/lib/audit.ts` — `logAuditEvent(action, entity, userId, diff?)` Helper
- [ ] Audit-Events in kritischen Operations eintragen:
      Kurs-Create/Delete, Enrollment-Create, Rollen-Änderung
- [ ] `src/app/(app)/settings/audit-log/page.tsx` — Audit-Log Übersicht für Admin
      (paginiert, filterbar nach Aktion/User/Datum)

## Abnahmekriterien
- [ ] Kurs-Erstellung schreibt Audit-Log-Eintrag
- [ ] Rollen-Änderung schreibt Audit-Log-Eintrag mit old/new-Value
- [ ] Audit-Log-Seite ist nur für Admin zugänglich
- [ ] Paginierung funktioniert (nicht alle Einträge auf einmal laden)

## Betroffene Dateien
- `src/db/schema/audit-log.ts` (neu)
- `src/lib/audit.ts` (neu)
- `src/app/(app)/settings/audit-log/page.tsx` (neu)

## Notizen
