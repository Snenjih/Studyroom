# T044: Analytics-Dashboard — Daten-Aggregationen

**Phase:** 05-extensions
**Status:** offen
**Abhängig von:** T043

## Kontext
Konzept Abschnitt 9: "Analytics-Dashboard — Fortschritt, Drop-off-Rate pro Block,
Zeit pro Lektion; gibt Trainern echten Mehrwert."

## Ziel
API-Endpunkte liefern aggregierte Daten für Trainer: Abschlussquote, Drop-off pro Block,
Anzahl Einschreibungen. Datenbankabfragen sind effizient (keine N+1-Queries).

## Schritte
- [ ] `src/lib/db/analytics.ts` — Aggregationsfunktionen:
      - `getCourseCompletionRate(courseId)`: abgeschlossen / eingeschrieben
      - `getBlockDropoffStats(courseId)`: pro Block: Anzahl Starts, Abbrüche, Abschlüsse
      - `getEnrollmentTimeline(courseId)`: Einschreibungen pro Woche/Monat
- [ ] `src/app/api/courses/[id]/analytics/route.ts` — GET: alle Aggregationen
- [ ] Datenbank-Queries mit Window-Functions oder GROUP BY statt App-seitiger Berechnung
- [ ] Permission: `analytics:view` (nur Trainer/Admin)

## Abnahmekriterien
- [ ] Completion-Rate gibt korrekte Prozentzahl zurück (0–100)
- [ ] Block-Dropoff zeigt für jeden Block: wie viele haben ihn gestartet/abgeschlossen
- [ ] Alle Queries laufen in < 200ms auf typischer Datengröße (1000 Einschreibungen)
- [ ] 403 für Learner (kein Zugriff auf Analytics)

## Betroffene Dateien
- `src/lib/db/analytics.ts` (neu)
- `src/app/api/courses/[id]/analytics/route.ts` (neu)

## Notizen
