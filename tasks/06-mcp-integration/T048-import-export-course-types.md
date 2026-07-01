# T048: Import/Export von Course-Types und Courses als JSON-Paket

**Phase:** 06-mcp-integration
**Status:** offen
**Abhängig von:** T047

## Kontext
Konzept Abschnitt 9: "Import/Export von Course-Types & Courses als JSON-Paket — macht
Typen zwischen Instanzen teilbar (Community-Marketplace-Idee für später)."

## Ziel
Admins können Course-Types und einzelne Kurse als JSON-Paket exportieren und auf einer
anderen Instanz importieren.

## Schritte
- [ ] `src/lib/export/course-type-export.ts` — serialisiert CourseType als JSON
      (schema_definition, Metadaten; keine org_id im Export)
- [ ] `src/lib/export/course-export.ts` — serialisiert Kurs inkl. aller Content-Blöcke
- [ ] `src/lib/import/course-type-import.ts` — importiert JSON, validiert Format, speichert
- [ ] `src/app/api/export/course-types/[id]/route.ts` — GET: JSON-Download
- [ ] `src/app/api/import/course-types/route.ts` — POST: JSON-Upload + Import
- [ ] `src/app/(app)/settings/course-types/[id]/page.tsx` — Export/Import-Buttons ergänzen

## Abnahmekriterien
- [ ] Export erzeugt valides JSON mit CourseType-Schema
- [ ] Import lädt JSON ein, legt neuen CourseType an (nicht überschreiben!)
- [ ] Import-Fehler werden klar kommuniziert (falsches Format, doppelter Key)
- [ ] org_id im Import wird auf aktuell eingeloggte Org gesetzt (kein Import von fremder org_id)

## Betroffene Dateien
- `src/lib/export/`, `src/lib/import/` (neu)
- `src/app/api/export/`, `src/app/api/import/` (neu)

## Notizen
