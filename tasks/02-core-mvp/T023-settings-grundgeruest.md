# T023: Settings-Grundgerüst (zentrale Settings-Seite)

**Phase:** 02-core-mvp
**Status:** offen
**Abhängig von:** T022

## Kontext
Konzept Abschnitt 10 (Phase 1): "Settings-Grundgerüst (ein zentraler Ort, erstmal nur
Kern-Einstellungen)." Wird in Phase 3 um Modul-Settings erweitert.

## Ziel
Eine Settings-Seite ist für Admins zugänglich und ermöglicht die Konfiguration von
Org-Name, Beschreibung und grundlegenden Anzeigeoptionen.

## Schritte
- [ ] `src/db/schema/settings.ts` — `org_settings`-Tabelle: `org_id`, `key`, `value JSONB`
      (Key-Value-Store für Einstellungen)
- [ ] Migration generieren und ausführen
- [ ] `src/app/api/settings/route.ts` — GET/PUT für Org-Einstellungen
- [ ] `src/app/(app)/settings/page.tsx` — Settings-Seite (nur für Admin)
- [ ] `src/components/settings/SettingsForm.tsx` — Formular: Org-Name, Beschreibung,
      Logo-Upload (MinIO)
- [ ] `src/lib/settings.ts` — `getSetting(key)`, `setSetting(key, value)` Helper

## Abnahmekriterien
- [ ] Org-Name und Beschreibung können gespeichert und wieder geladen werden
- [ ] Settings-Seite ist nur für Admin erreichbar (403 für andere Rollen)
- [ ] Gespeicherte Einstellungen überleben einen Server-Neustart (in DB, nicht Memory)

## Betroffene Dateien
- `src/db/schema/settings.ts` (neu)
- `src/app/(app)/settings/page.tsx` (neu)
- `src/app/api/settings/route.ts`, `src/lib/settings.ts` (neu)

## Notizen
