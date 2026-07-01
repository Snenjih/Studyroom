# T056: Environment-Variablen vollständig dokumentieren

**Phase:** 07-self-hosting-reife
**Status:** offen
**Abhängig von:** T055

## Kontext
Konzept Abschnitt 10 (Phase 6): Dokumentation für andere Self-Hoster. Vollständige
ENV-Doku ist der häufigste Schmerzpunkt beim Self-Hosting.

## Ziel
Alle ENV-Variablen sind in `.env.example` dokumentiert mit Beschreibung, Typ,
Pflicht/Optional-Status und Default-Wert.

## Schritte
- [ ] Alle ENV-Variablen aus dem gesamten Codebase sammeln (grep nach `process.env.`)
- [ ] `.env.example` vollständig aktualisieren: jede Variable mit Kommentar-Zeile
      (`# Beschreibung | Typ | Pflicht | Default: xxx`)
- [ ] `src/lib/env.ts` — `z.object({...})` Schema für alle ENV-Variablen (zod-Validierung
      beim App-Start; fehlende Pflicht-Vars → Fehler mit klarer Nachricht)
- [ ] App-Start schlägt fehl mit lesbarer Fehlermeldung wenn Pflicht-ENV fehlt

## Abnahmekriterien
- [ ] `.env.example` hat für jede Variable eine Kommentar-Zeile
- [ ] `src/lib/env.ts` validiert alle Pflicht-Variablen beim Start
- [ ] App wirft `Error: Missing required env: DATABASE_URL` (nicht unklar crasht)
- [ ] Keine ENV-Variable im Code die nicht in `.env.example` ist

## Betroffene Dateien
- `.env.example`
- `src/lib/env.ts` (neu)

## Notizen
