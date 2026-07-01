# T030: Dynamische Permissions aus Modulen

**Phase:** 03-module-system
**Status:** offen
**Abhängig von:** T029

## Kontext
Konzept Abschnitt 8: "Module können eigene Permissions registrieren. Die Rollen-UI in den
Settings muss dynamisch alle registrierten Permissions aus allen aktiven Modulen anzeigen."
Beispiel: Code-Execution-Modul registriert `"code:execute"`.

## Ziel
Permissions werden aus der AppConfig-Registry gelesen statt aus einer statischen Liste.
Die Settings-Rollen-UI zeigt alle Permissions aller aktiven Module an.

## Schritte
- [ ] `AppConfig.permissions` (T024) wird beim App-Start aus der Registry gelesen
- [ ] `src/app/api/permissions/route.ts` — GET: gibt alle registrierten Permissions zurück
- [ ] Settings → Rollen-Verwaltungsseite: lädt Permissions dynamisch aus API
- [ ] `src/app/(app)/settings/roles/page.tsx` — Rollen-UI: Liste + Permissions zuweisen
- [ ] `src/app/(app)/settings/roles/[id]/page.tsx` — einzelne Rolle bearbeiten
- [ ] Permissions in DB (T005) werden beim Start mit Registry abgeglichen (neue eintragen,
      veraltete als deprecated markieren)

## Abnahmekriterien
- [ ] Ein neues Modul mit `permissions: ['new:perm']` taucht in der Rollen-UI auf
- [ ] Rollen können über die UI mit beliebigen Permissions konfiguriert werden
- [ ] Kein Hardcoded-Permissions-Array mehr in der Rollen-UI
- [ ] Rollen-Änderungen greifen sofort (kein Server-Neustart nötig)

## Betroffene Dateien
- `src/app/(app)/settings/roles/` (neu)
- `src/app/api/permissions/route.ts` (neu)
- `src/lib/module-system/registry.ts`

## Notizen
