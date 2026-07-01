# Projekt-Fortschritt

👉 **Nächste Task:** T009 — Drizzle-Schema für programs und courses anlegen (Phase 01 abgeschlossen)

## Phase 00 — Bootstrap
- [x] T000 — Vollständigen Task-Breakdown generieren (`tasks/00-bootstrap/`)

## Phase 01 — Fundament (8 Tasks)
- [x] T001 — Next.js-Projekt-Grundgerüst initialisieren
- [x] T002 — Docker-Compose-Skeleton aufsetzen
- [x] T003 — Drizzle ORM einrichten und Datenbankverbindung herstellen
- [x] T004 — Drizzle-Schema für organizations und users anlegen
- [x] T005 — Drizzle-Schema für roles und permissions anlegen
- [x] T006 — Auth-System einrichten (Login, Sessions)
- [x] T007 — RBAC-Middleware und Permission-Checks implementieren
- [x] T008 — Seed-Skript für Basis-Daten

## Phase 02 — Core MVP (15 Tasks)
- [ ] T009 — Drizzle-Schema für programs und courses anlegen
- [ ] T010 — Drizzle-Schema für content_blocks anlegen
- [ ] T011 — Drizzle-Schema für enrollments und block_progress anlegen
- [ ] T012 — Hartcodierte Course-Types als Seed-Daten anlegen
- [ ] T013 — Programs-CRUD-API (Route Handlers)
- [ ] T014 — Courses-CRUD-API (Route Handlers)
- [ ] T015 — Dashboard-Seite (Übersicht eigener/zugewiesener Kurse)
- [ ] T016 — Programs-Verwaltungsseite (Liste + Create/Edit/Delete UI)
- [ ] T017 — Courses-Verwaltungsseite (Liste + Create/Edit/Delete UI)
- [ ] T018 — Course-Type "Markdown-Info" — Renderer + Block-Editor
- [ ] T019 — Course-Type "Flashcards" — Renderer + Block-Editor
- [ ] T020 — Course-Type "Einfaches Quiz" — Renderer + Block-Editor
- [ ] T021 — Enrollments-API (einschreiben, austragen, Status)
- [ ] T022 — Progress-Tracking-API (Block-Status, Kursfortschritt)
- [ ] T023 — Settings-Grundgerüst (zentrale Settings-Seite)

## Phase 03 — Modul-System & Type-Engine (9 Tasks)
- [ ] T024 — Modul-Registry Grundstruktur (AppConfig-Pattern)
- [ ] T025 — Bestehende Course-Types als Module umbauen
- [ ] T026 — Generisches schema_definition-System für Course-Types
- [ ] T027 — Schema-Validierungsschicht für content_blocks
- [ ] T028 — Type-Editor UI — Felder-Builder-Komponente
- [ ] T029 — Type-Editor UI — Vorschau-Renderer für Custom-Types
- [ ] T030 — Dynamische Permissions aus Modulen
- [ ] T031 — Modul-Lade-Mechanismus (Konfigurationsbasiert)
- [ ] T032 — Content-Versionierung für Course-Types

## Phase 04 — Code-Execution-Modul (6 Tasks)
- [ ] T033 — Piston-Service im Docker-Compose-Stack ergänzen
- [ ] T034 — Sandbox-Execution-Service-Schnittstelle
- [ ] T035 — Ressourcenlimits und Netzwerk-Isolation konfigurieren
- [ ] T036 — Course-Type "Softwareentwicklung" — Block-Schema + Execution-Anbindung
- [ ] T037 — Testfall-Feedback-Engine
- [ ] T038 — Code-Editor-Komponente im Frontend

## Phase 05 — Ausbau (9 Tasks)
- [ ] T039 — Zertifikat-Modul — Datenmodell und Abschlussregeln
- [ ] T040 — Zertifikat-Ausstellung und PDF-Generierung
- [ ] T041 — Foren/Diskussionen-Modul — Datenmodell
- [ ] T042 — Foren/Diskussionen — API und UI
- [ ] T043 — Benachrichtigungen-Modul (In-App)
- [ ] T044 — Analytics-Dashboard — Daten-Aggregationen
- [ ] T045 — Analytics-Dashboard — UI für Trainer
- [ ] T046 — Audit-Log
- [ ] T047 — Internationalisierung (i18n) Grundgerüst

## Phase 06 — MCP & Integrationen (6 Tasks)
- [ ] T048 — Import/Export von Course-Types und Courses als JSON-Paket
- [ ] T049 — MCP-Server — Grundgerüst
- [ ] T050 — MCP-Server — Kurse, Programme und Fortschritt als Tools
- [ ] T051 — MCP-Server — Einschreibungen und User-Daten als Tools
- [ ] T052 — REST-API — OpenAPI-Spezifikation einrichten
- [ ] T053 — Webhooks (Event-System)

## Phase 07 — Self-Hosting-Reife (7 Tasks)
- [ ] T054 — Backup/Restore-Tooling
- [ ] T055 — Update-Mechanismus zwischen Versionen
- [ ] T056 — Environment-Variablen vollständig dokumentieren
- [ ] T057 — Health-Check-Endpunkte
- [ ] T058 — Self-Hosting-Dokumentation
- [ ] T059 — White-Labeling und Theming pro Instanz
- [ ] T060 — Performance-Tuning (JSONB-Indizes, Query-Optimierungen)

---

**Gesamt:** 60 Tasks (T001–T060) + T000 (erledigt)
