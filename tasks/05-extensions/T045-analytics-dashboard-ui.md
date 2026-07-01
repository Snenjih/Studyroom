# T045: Analytics-Dashboard — UI für Trainer

**Phase:** 05-extensions
**Status:** offen
**Abhängig von:** T044

## Kontext
Konzept Abschnitt 9: Analytics-Dashboard gibt Trainern echten Mehrwert. Charts für
Abschlussquote, Drop-off, Einschreibungs-Timeline.

## Ziel
Trainer können auf einer Kurs-Analytics-Seite Fortschritts- und Drop-off-Daten
visuell aufbereitet einsehen.

## Schritte
- [ ] Chart-Library installieren (`recharts` oder `chart.js` — recharts bevorzugt für React)
- [ ] `src/app/(app)/courses/[id]/analytics/page.tsx` — Analytics-Seite (nur Trainer)
- [ ] `src/components/analytics/CompletionRateChart.tsx` — Donut-Chart: abgeschlossen/in Arbeit/nicht gestartet
- [ ] `src/components/analytics/BlockDropoffChart.tsx` — Balkendiagramm: Drop-off pro Block
- [ ] `src/components/analytics/EnrollmentTimeline.tsx` — Liniendiagramm: Einschreibungen über Zeit
- [ ] Summary-Kacheln: Gesamteinschreibungen, Abschlussquote, Ø Score

## Abnahmekriterien
- [ ] Charts rendern mit echten Daten aus T044-API
- [ ] Seite ist mobil-responsive (Charts skalieren)
- [ ] Seite nur für Trainer/Admin zugänglich
- [ ] Leerer Zustand wenn keine Daten vorhanden ("Noch keine Einschreibungen")

## Betroffene Dateien
- `src/app/(app)/courses/[id]/analytics/page.tsx` (neu)
- `src/components/analytics/` (neu)

## Notizen
