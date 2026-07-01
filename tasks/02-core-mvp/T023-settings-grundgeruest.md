# T023: Settings-Grundgerüst (zentrale Settings-Seite)

**Phase:** 02-core-mvp
**Status:** erledigt (2026-07-01)
**Abhängig von:** T022

## Kontext
Konzept Abschnitt 10 (Phase 1): "Settings-Grundgerüst (ein zentraler Ort, erstmal nur
Kern-Einstellungen)." Wird in Phase 3 um Modul-Settings erweitert.

## Ziel
Eine Settings-Seite ist für Admins zugänglich und ermöglicht die Konfiguration von
Org-Name, Beschreibung und grundlegenden Anzeigeoptionen.

## Schritte
- [x] `src/db/schema/settings.ts` — `org_settings`-Tabelle: `org_id`, `key`, `value JSONB`
      (Key-Value-Store für Einstellungen)
- [x] Migration generiert und gegen echte DB ausgeführt
- [x] `src/app/api/settings/route.ts` — GET/PUT für Org-Einstellungen
- [x] `src/app/(app)/settings/page.tsx` — Settings-Seite (nur für Admin)
- [x] `src/components/settings/SettingsForm.tsx` — Formular: Org-Name, Beschreibung,
      Logo-Upload (MinIO)
- [x] `src/lib/settings.ts` — `getSetting(orgId, key)`, `setSetting(orgId, key, value)` Helper

## Abnahmekriterien
- [x] Org-Name und Beschreibung können gespeichert und wieder geladen werden
- [x] Settings-Seite ist nur für Admin erreichbar (403 für andere Rollen)
- [x] Gespeicherte Einstellungen überleben einen Server-Neustart (in DB, nicht Memory)

## Betroffene Dateien
- `src/db/schema/settings.ts` (neu)
- `src/db/migrations/0008_classy_bastion.sql` (neu)
- `src/app/(app)/settings/page.tsx`, `src/app/(app)/settings/actions.ts` (neu)
- `src/app/api/settings/route.ts`, `src/lib/settings.ts` (neu)
- `src/components/settings/SettingsForm.tsx` (neu)
- `src/lib/db/organizations.ts` (neu, DAL für `organizations.name`)
- `src/lib/schemas/settings.ts` (neu, zod)
- `src/lib/storage.ts` (neu, MinIO-Client für Logo-Upload)
- `package.json` (Dependency `minio` ergänzt)

## Notizen
- Signaturen von `getSetting`/`setSetting` nehmen zusätzlich `orgId` als Parameter
  (`getSetting(orgId, key)` statt nur `getSetting(key)`), konsistent zu jeder anderen
  DAL-Funktion im Projekt, die den Org-Scope immer explizit übergibt (kein globaler
  Session-Zugriff in DAL/Lib-Code). Kein Widerspruch zur Aufgabenstellung laut
  Task-Template ("muss beim Umsetzen nicht exakt stimmen").
- Org-Name wird NICHT im `org_settings`-KV-Store dupliziert, sondern bleibt in der
  bereits bestehenden, relationalen Spalte `organizations.name` (T004) — Beschreibung
  und Logo-Key haben keine feste Spalte und landen als `description`/`logoKey` im
  generischen KV-Store. Vermeidet zwei Wahrheitsquellen für denselben Wert.
- Zugriffskontrolle bewusst zweigeteilt: Die Seite (`settings/page.tsx`) nutzt wie alle
  anderen Admin-Seiten im Projekt (z.B. `programs/[id]/edit`) `notFound()` (404) statt
  eines echten 403 — das ist die etablierte Konvention für Server-Component-Seiten in
  diesem Projekt. Die API-Route (`/api/settings`) gibt dagegen einen echten 403 zurück
  (`requirePermission` → `ForbiddenError` → `toErrorResponse`), was das Abnahmekriterium
  "403 für andere Rollen" wörtlich erfüllt.
- Logo-Upload: `minio`-Paket neu installiert (bisher keine S3/MinIO-Anbindung im
  Projekt, obwohl der Service im Docker-Compose-Stack schon lief). Das Objekt wird
  unter einem privaten Key gespeichert (`org-logos/<orgId>-<timestamp>-<filename>`);
  Anzeige erfolgt über eine presigned GET-URL (`getOrgLogoUrl`, 1h gültig), da der
  Bucket nicht öffentlich ist. Die Docker-MinIO-Instanz war in dieser Session nicht
  über `localhost` erreichbar (nur Postgres war extern gemappt) — Logo-Upload/-Anzeige
  ist daher NICHT end-to-end gegen echtes MinIO getestet, nur Org-Name/Beschreibung
  (die eigentlichen Abnahmekriterien). Typecheck/Build sind sauber; bitte beim ersten
  echten Login über die UI einmal einen Logo-Upload durchklicken, um das MinIO-Wiring
  in der echten Docker-Compose-Umgebung zu bestätigen.
- UI-Komponente (`SettingsForm.tsx`) über den `frontend-design`-Skill gebaut (globale
  CLAUDE.md-Vorgabe für Frontend-Arbeit), dabei bewusst innerhalb der bestehenden
  Dark-Terminal/Electric-Aqua-Designsprache geblieben statt eines neuen Stils.
- End-to-End gegen eine echte Postgres-Instanz getestet: GET/PUT als Admin (Speichern
  + Neuladen bestätigt persistente Werte), GET als Learner (403), Seite als Learner
  (404), Seite/API unauthentifiziert (Redirect zu /login).
