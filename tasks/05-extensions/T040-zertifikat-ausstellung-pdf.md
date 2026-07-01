# T040: Zertifikat-Ausstellung und PDF-Generierung

**Phase:** 05-extensions
**Status:** offen
**Abhängig von:** T039

## Kontext
Konzept Abschnitt 9: Zertifikat-Modul. Nach Kursabschluss (und Erfüllung der
Abschlussregeln aus T039) wird ein Zertifikat ausgestellt und als PDF abrufbar.

## Ziel
Wenn alle Abschlussregeln erfüllt sind, wird automatisch ein Zertifikat erzeugt
und in MinIO gespeichert. Learner können es als PDF herunterladen.

## Schritte
- [ ] PDF-Bibliothek installieren (`@react-pdf/renderer` oder `puppeteer`)
- [ ] `src/modules/certificates/CertificatePDF.tsx` — PDF-Template (Name, Kurs, Datum,
      Org-Name/-Logo)
- [ ] `src/lib/certificates/generate-pdf.ts` — erzeugt PDF-Buffer, speichert in MinIO
- [ ] `src/app/api/certificates/[id]/download/route.ts` — gibt PDF aus MinIO zurück
- [ ] Zertifikat-Trigger: nach `onCourseComplete`-Hook → `checkCertificateEligibility()`
      → bei true: `generateAndStoreCertificate()`
- [ ] Dashboard (T015): Zertifikat-Download-Link wenn `completed_at` gesetzt

## Abnahmekriterien
- [ ] Nach Kursabschluss mit ausreichendem Score wird Zertifikat in DB + MinIO gespeichert
- [ ] PDF enthält Lernenden-Name, Kurs-Titel, Abschlussdatum, Org-Name
- [ ] Download-Link gibt den korrekten PDF-Content-Type zurück
- [ ] Zertifikat nur einmal ausgestellt (kein Duplikat bei erneutem Kursaufruf)

## Betroffene Dateien
- `src/modules/certificates/CertificatePDF.tsx` (neu)
- `src/lib/certificates/generate-pdf.ts` (neu)
- `src/app/api/certificates/[id]/download/route.ts` (neu)

## Notizen
