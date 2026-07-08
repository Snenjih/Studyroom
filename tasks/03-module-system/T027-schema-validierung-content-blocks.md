# T027: Schema-Validierungsschicht für content_blocks

**Phase:** 03-module-system
**Status:** erledigt (2026-07-08)
**Abhängig von:** T026

## Kontext
Konzept Abschnitt 4: "`content` in `content_blocks` wird beim Speichern gegen
`course_types.schema_definition` geprüft." Validierung in der App-Schicht, nicht DB.

## Ziel
Das Speichern eines Content-Blocks validiert `block_type` und `content` gegen die
`schema_definition` des zugehörigen Course-Types. Ungültige Blöcke werden abgelehnt (400).

## Schritte
- [x] `src/lib/db/courses.ts` — Block-Create/Update-Funktionen um Validierung erweitert:
      CourseType laden → schema_definition auslesen → `validateBlock()` aufrufen
- [x] Fehlerformat standardisiert: `{ field: string, message: string }[]`
- [x] API-Layer gibt 400 mit Validierungsfehlern zurück
- [x] `src/lib/schema-definition/validator.ts` (T026) über Zod-Integration abgesichert
- [x] Integrationstests: Block mit falschem Typ erstellen → 400 erwartet

## Abnahmekriterien
- [x] POST /courses/:id/blocks mit falschem block_type gibt 400 zurück
- [x] POST mit fehlendem Pflichtfeld gibt 400 mit Feldname zurück
- [x] Gültiger Block wird gespeichert (200/201)
- [x] Validierung läuft vor dem DB-INSERT (kein Rollback nötig)

## Betroffene Dateien
- `src/lib/db/courses.ts`
- `src/app/api/courses/[id]/blocks/route.ts` (unverändert — nutzt bereits `toErrorResponse()`)

## Notizen
- Neue `BlockValidationError` (in `src/lib/db/courses.ts`) trägt die `ValidationError[]`
  und wird in `createBlock()`/`updateBlock()` geworfen, **bevor** der DB-INSERT/UPDATE
  läuft (Validierung erfolgt gegen eine vorherige SELECT-Query, die Course-Type +
  Org-Scope in einem Rutsch prüft — kein Rollback nötig).
- `src/lib/api-error.ts` (`toErrorResponse()`) bildet `BlockValidationError` zentral auf
  `400 { error, details: [{field, message}] }` ab — beide Block-Routen
  (`blocks/route.ts` POST, `blocks/[blockId]/route.ts` PUT) nutzten bereits
  `toErrorResponse()`, brauchten also keine Änderung.
- `updateBlock()` validiert gegen den **gespeicherten** `block_type` des existierenden
  Blocks (aus einer zusätzlichen SELECT-Query) — `block_type` selbst ist über das
  Update-Schema (`updateBlockSchema`, nur `content`) ohnehin nicht änderbar.
- Zod-Integration: `validateBlock()` prüft zuerst die äußere Block-Hülle
  (`{blockType: string, content: record}`) über ein Zod-Schema, bevor die
  feld-spezifische (hand-geschriebene) Prüfung läuft — schützt vor grob falsch
  geformtem Input, bevor überhaupt in die dynamische Feld-Logik eingestiegen wird.
- Beim Implementieren einen echten Bug in `validateField()`s `default`-Zweig gefunden
  und gefixt: bei einem unbekannten/veralteten Feld-Typ (z.B. Restdaten aus der Zeit vor
  T026 in der DB) gab die Funktion durch den `never`-Exhaustiveness-Cast eine
  falsch geformte, nicht-Array-Rückgabe zurück, die in `flatMap()` zu einem stillen
  Fehlschlag führte, statt eine echte `ValidationError` zu erzeugen — jetzt behoben
  (Test dafür in `validator.test.ts`).
- Neuer echter Integrationstest `src/lib/db/courses.integration.test.ts` läuft gegen
  die lokale Dev-Postgres (siehe CLAUDE.md), legt ein eigenes temporäres Program/Course
  an und räumt via `deleteProgram()` (Cascade-Delete) wieder auf — rührt keine
  Seed-Daten an. Dafür zwei Infrastruktur-Anpassungen nötig:
  - `npm test` läuft jetzt mit `--conditions=react-server`, damit das `server-only`-Marker-
    Paket (das `src/lib/db/*.ts` importieren) nicht mit seiner Client-Component-Fehlermeldung
    abbricht — außerhalb des Next.js-Webpack-Builds fehlt sonst die Bedingung, die es
    zur No-Op macht.
  - `src/db/index.ts` exportiert jetzt `closeDb()`, damit der Test-Prozess die offene
    Postgres-Connection sauber schließen und beenden kann.
- `npm run db:seed` musste einmalig neu ausgeführt werden, damit die bereits in der
  Dev-DB liegenden `course_types`-Zeilen das neue T026-Feld-Format bekommen — sonst
  schlug die Validierung eines eigentlich gültigen Blocks fehl (siehe Bugfix oben, exakt
  dieses Szenario).
- TypeScript-Compile, `npm test` (18/18, inkl. Integrationstest) und `eslint` laufen
  fehlerfrei durch. Manuelle End-to-End-Bestätigung über die echte REST-Route folgt im
  abschließenden Playwright-Durchlauf (Login/Server-Actions sind über reines `curl` ohne
  Next-Action-Encoding nicht praktikabel zu testen).
