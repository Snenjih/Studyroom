# T059: White-Labeling und Theming pro Instanz

**Phase:** 07-self-hosting-reife
**Status:** offen
**Abhängig von:** T058

## Kontext
Konzept Abschnitt 9: "White-Labeling/Theming pro Instanz — passt zu deiner bestehenden
Design-Sprache (Dark-Terminal/Electric-Aqua), als konfigurierbares Theme statt Hardcoding."

## Ziel
Admins können Org-Name, Logo, Primärfarbe und Dark/Light-Mode über die Settings
konfigurieren. Änderungen wirken sich sofort auf die gesamte App aus.

## Schritte
- [ ] CSS-Custom-Properties für Primärfarbe, Hintergrund, Akzentfarbe in globales CSS
- [ ] Settings-Seite (T023) um Theme-Einstellungen erweitern: Primärfarbe (Color-Picker),
      Logo-Upload, App-Name (wird im Titel angezeigt)
- [ ] `src/lib/theme.ts` — lädt Theme-Config aus Settings, generiert CSS-Variablen-Objekt
- [ ] `src/app/layout.tsx` — injiziert CSS-Variablen im `<style>`-Tag basierend auf Settings
- [ ] Dark/Light-Mode Toggle (User-Präferenz, gespeichert in User-Settings)
- [ ] Logo wird aus MinIO geladen und im Navbar-Header angezeigt

## Abnahmekriterien
- [ ] Primärfarbe-Änderung in Settings → alle Buttons/Links in neuer Farbe
- [ ] Logo-Upload ersetzt den Standard-Studyroom-Schriftzug
- [ ] Dark/Light-Mode-Wechsel ohne Seitenreload
- [ ] Theme-Änderungen wirken für alle User der Instanz

## Betroffene Dateien
- `src/lib/theme.ts` (neu)
- `src/app/layout.tsx`, globale CSS-Datei
- `src/app/(app)/settings/page.tsx`

## Notizen
