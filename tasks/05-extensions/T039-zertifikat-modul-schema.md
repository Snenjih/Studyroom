# T039: Zertifikat-Modul — Datenmodell und Abschlussregeln

**Phase:** 05-extensions
**Status:** offen
**Abhängig von:** T038

## Kontext
Konzept Abschnitt 9: "Zertifikate & Abschlussregeln als eigenes Modul, das an beliebige
Course-Types andockt ('wenn alle Blöcke done UND Score ≥ X → Zertifikat ausstellen')."

## Ziel
Das Datenmodell für Zertifikate ist vorhanden. Abschlussregeln können pro Kurs
konfiguriert werden (Mindest-Score, Pflicht-Blöcke etc.).

## Schritte
- [ ] `src/db/schema/certificates.ts` — Tabelle: `id`, `user_id`, `course_id`,
      `enrollment_id`, `issued_at`, `certificate_data JSONB`
- [ ] `src/db/schema/certificate-rules.ts` — Tabelle: `course_id`, `min_score` (0–100),
      `require_all_blocks` (bool), `custom_rules JSONB`
- [ ] Migration generieren und ausführen
- [ ] `src/lib/certificates/check-completion.ts` — `checkCertificateEligibility()`:
      prüft Abschlussregeln gegen Enrollment-Progress
- [ ] `src/modules/certificates/index.ts` — `certificatesModule: AppModule`
      (Hook: `onCourseComplete → checkCertificateEligibility`)

## Abnahmekriterien
- [ ] `certificates`- und `certificate-rules`-Tabellen existieren in der DB
- [ ] `checkCertificateEligibility()` gibt `true` wenn alle Regeln erfüllt
- [ ] Modul ist deaktivierbar ohne Core-Fehler
- [ ] Abschlussregeln können pro Kurs in den Kurs-Einstellungen gesetzt werden

## Betroffene Dateien
- `src/db/schema/certificates.ts`, `certificate-rules.ts` (neu)
- `src/lib/certificates/check-completion.ts` (neu)
- `src/modules/certificates/index.ts` (neu)

## Notizen
