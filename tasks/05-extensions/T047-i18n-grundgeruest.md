# T047: Internationalisierung (i18n) Grundgerüst

**Phase:** 05-extensions
**Status:** offen
**Abhängig von:** T046

## Kontext
Konzept Abschnitt 9: "Mehrsprachigkeit (i18n) — gerade bei Ausbildungsinhalten evtl.
relevant." Deutsch als primäre Sprache, Englisch als zweite Sprache.

## Ziel
Die App unterstützt Deutsch und Englisch. UI-Strings sind externalisiert und über
`next-intl` steuerbar. Sprache ist per User-Setting wählbar.

## Schritte
- [ ] `next-intl` installieren und konfigurieren
- [ ] `src/messages/de.json` und `src/messages/en.json` anlegen
- [ ] Alle bestehenden hardcodierten UI-Strings in Messages extrahieren
      (Navigation, Buttons, Fehlermeldungen, leere Zustände)
- [ ] Sprach-Auswahl in User-Settings speichern (`users.locale`-Spalte oder Settings-Key)
- [ ] `next.config.ts` und Middleware für Locale-Routing konfigurieren
- [ ] Locale-Switch-Komponente in der Navbar

## Abnahmekriterien
- [ ] Sprachwechsel zu Englisch übersetzt alle UI-Strings
- [ ] Gewählte Sprache bleibt nach Reload erhalten (in Settings gespeichert)
- [ ] Kein hardcodierter Deutsch-String mehr in Komponenten (alles über t()-Funktion)
- [ ] Missing-Translation-Warnung in Dev-Mode (kein silentes Fallback)

## Betroffene Dateien
- `src/messages/de.json`, `en.json` (neu)
- `next.config.ts`, `src/middleware.ts`
- Alle Komponenten mit UI-Text (viele Dateien)

## Notizen
