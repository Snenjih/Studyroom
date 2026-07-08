# T030: Dynamische Permissions aus Modulen

**Phase:** 03-module-system
**Status:** erledigt (2026-07-08)
**Abhängig von:** T029

## Kontext
Konzept Abschnitt 8: "Module können eigene Permissions registrieren. Die Rollen-UI in den
Settings muss dynamisch alle registrierten Permissions aus allen aktiven Modulen anzeigen."
Beispiel: Code-Execution-Modul registriert `"code:execute"`.

## Ziel
Permissions werden aus der AppConfig-Registry gelesen statt aus einer statischen Liste.
Die Settings-Rollen-UI zeigt alle Permissions aller aktiven Module an.

## Schritte
- [x] `AppConfig.permissions` (T024) wird bei jedem Zugriff auf die Rollen-Verwaltung
      mit der DB abgeglichen (statt einmalig beim App-Start, siehe Notizen)
- [x] `src/app/api/permissions/route.ts` — GET: gibt alle registrierten Permissions zurück
- [x] Settings → Rollen-Verwaltungsseite: lädt Permissions dynamisch (aus DB, per
      Registry-Abgleich synchronisiert)
- [x] `src/app/(app)/settings/roles/page.tsx` — Rollen-UI: Liste + Permissions zuweisen
- [x] `src/app/(app)/settings/roles/[id]/page.tsx` — einzelne Rolle bearbeiten
- [x] Permissions in DB (T005) werden bei jedem Zugriff mit Registry abgeglichen (neue
      eintragen, veraltete als `deprecated` markieren — neue Spalte `permissions.deprecated`)

## Abnahmekriterien
- [x] Ein neues Modul mit `permissions: ['new:perm']` taucht in der Rollen-UI auf
- [x] Rollen können über die UI mit beliebigen Permissions konfiguriert werden
- [x] Kein Hardcoded-Permissions-Array mehr in der Rollen-UI
- [x] Rollen-Änderungen greifen sofort (kein Server-Neustart nötig)

## Betroffene Dateien
- `src/app/(app)/settings/roles/` (neu: `page.tsx`, `[id]/page.tsx`, `actions.ts`)
- `src/app/api/permissions/route.ts` (neu)
- `src/lib/module-system/types.ts` (`PermissionDefinition.moduleKey` ergänzt)
- `src/lib/db/permissions.ts`, `src/lib/db/roles.ts` (neu)
- `src/components/settings/RolePermissionsForm.tsx` (neu)
- `src/db/schema/permissions.ts` (Spalte `deprecated`), Migration `0009_petite_speed.sql`
- `src/app/(app)/settings/page.tsx` (Link zu Rollen ergänzt)

## Notizen
- Der Registry-Abgleich läuft **bei jedem** Aufruf von `listAssignablePermissions()`
  (Rollen-Seite, `/api/permissions`), nicht nur einmalig beim App-Start: Next.js hat im
  App Router keinen über alle Deployment-Ziele (Node-Server, Edge, Serverless) hinweg
  zuverlässigen einzelnen Boot-Hook, und der Abgleich ist für eine Admin-Settings-Seite
  günstig genug. Das erfüllt "beim App-Start gelesen" strenger, als es eine einmalige
  Boot-Synchronisation könnte — Änderungen an aktiven Modulen wirken sich sofort aus,
  ganz ohne Neustart.
- `permissions.deprecated` (neue Spalte, Migration `0009`) statt Zeilen zu löschen: eine
  Permission kann noch über `role_permissions` referenziert sein (Fremdschlüssel), und
  ein deaktiviertes Modul könnte später reaktiviert werden — Löschen würde bestehende
  Rollen-Zuweisungen stillschweigend zerstören. `listAssignablePermissions()` blendet
  deprecated Permissions aus der Zuweisungs-UI aus, `role_permissions`-Zeilen bleiben
  aber unangetastet bestehen.
- `PermissionDefinition` (Modul-System-Typen, T024) hat jetzt ein optionales
  `moduleKey`-Feld — Module sollten es beim Registrieren auf ihren eigenen `AppModule.key`
  setzen, damit der DB-Abgleich weiß, welches Modul eine Permission "besitzt"
  (`permissions.module_key`, bereits seit T005 vorgesehen).
- Aktuell registriert keines der drei Course-Type-Module (T025) eigene Permissions — das
  Beispiel aus dem Konzept ("code:execute") gehört zum Code-Execution-Modul aus Phase 4.
  Das Abnahmekriterium "ein neues Modul mit Permission taucht auf" ist über einen echten
  Integrationstest bewiesen (`src/lib/db/permissions.integration.test.ts`: registriert
  ein Test-Modul zur Laufzeit in der echten `moduleRegistry` und prüft, dass die
  Permission danach in `listAssignablePermissions()` auftaucht), statt eine spekulative
  Produktions-Permission zu erfinden.
- "Rollen-Änderungen greifen sofort" war bereits vorher architektonisch gegeben:
  `getUserPermissions()` (`rbac.ts`) macht bei jedem Permission-Check einen Live-JOIN
  über `role_permissions`, kein Caching — hier nur bestätigt/dokumentiert, keine
  Code-Änderung nötig.
- Manuell mit Playwright verifiziert: Login → Settings → Rollen → "learner" → alle 8
  Core-Permissions dynamisch gelistet (keine hartcodiert im Formular) → `enrollments:manage`
  angehakt → gespeichert → "✓ Gespeichert — sofort wirksam" → per `psql` direkt in der DB
  bestätigt, dass `role_permissions` den neuen Eintrag enthält → Zustand danach wieder
  zurückgesetzt (leere Permission-Liste für `learner`, wie vor dem Test).
- TypeScript-Compile, `npm test` (35/35) und `eslint` laufen fehlerfrei durch.
