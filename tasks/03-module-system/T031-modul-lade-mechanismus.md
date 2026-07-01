# T031: Modul-Lade-Mechanismus (Konfigurationsbasiert)

**Phase:** 03-module-system
**Status:** offen
**Abhängig von:** T030

## Kontext
Konzept Abschnitt 2: Module sind an/abschaltbar. Konfiguration bestimmt, welche Module
aktiv sind. Settings-Panel zeigt aktive/inaktive Module.

## Ziel
Module können über eine Konfigurationsdatei oder Settings ein-/ausgeschaltet werden.
Nur aktive Module werden beim App-Start in der Registry registriert.

## Schritte
- [ ] `src/config/modules.config.ts` — Liste aktivierter Module-Keys (aus ENV oder Datei)
- [ ] `src/app-config.ts` — lädt nur Module aus `modules.config.ts`
- [ ] Settings-Seite: `src/app/(app)/settings/modules/page.tsx` — Liste aller verfügbaren
      Module (aktiv/inaktiv), kurze Beschreibung
- [ ] API: POST /api/settings/modules/:key/toggle — Modul aktivieren/deaktivieren
- [ ] Änderung erfordert App-Neustart (klar kommunizieren in der UI)

## Abnahmekriterien
- [ ] Ein Modul kann in der Config deaktiviert werden — sein CourseType erscheint nicht mehr
- [ ] Settings zeigt welche Module aktiv sind
- [ ] Deaktiviertes Modul-Permission taucht nicht mehr in der Rollen-UI auf
- [ ] Bestehende Kurse mit deaktiviertem Type zeigen Fallback-Hinweis (nicht 500)

## Betroffene Dateien
- `src/config/modules.config.ts` (neu)
- `src/app/(app)/settings/modules/page.tsx` (neu)
- `src/app/api/settings/modules/[key]/route.ts` (neu)
- `src/app-config.ts`

## Notizen
