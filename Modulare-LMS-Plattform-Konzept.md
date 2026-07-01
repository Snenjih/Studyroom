# Modulare Learning-Plattform — Konzept, Analyse & Roadmap

**Stand:** Juli 2026 · **Kontext:** Selbstgehostete, Docker-basierte, vollständig modulare Alternative zu ClassroomIO/Moodle mit frei definierbaren Course-Typen.

---

## 1. Einordnung deiner Idee

Die Grundidee ist stärker als das, was aktuelle Open-Source-LMS bieten. ClassroomIO (SvelteKit + Supabase/Postgres + Redis, MCP-Server, self-hostbar via Docker) ist der nächste Verwandte — aber Course-Typen sind dort fix vorgegeben (Lessons, Assignments, Zertifikate). Dein Kernunterschied: **Course-Typen selbst sind Daten, keine Features.** Das ist konzeptionell näher an dem, was Headless-CMS wie Strapi oder Payload CMS mit ihrem "Content-Type-Builder" machen (Felder/Components frei definieren, daraus wiederverwendbare Schemas bauen) — nur angewendet auf Lerninhalte statt auf Marketing-Content.

**Das ist der richtige Vergleich, nicht "LMS xy nachbauen".** Du baust im Kern ein headless content-modeling system für Bildungsinhalte, mit einem LMS als eine Anwendung darüber. Das ist deutlich ambitionierter als ClassroomIO — realistisch einschätzen, dazu mehr in Abschnitt 8.

**Kurzbewertung der Anforderungen:**

| Anforderung | Einschätzung |
|---|---|
| Modularer Core mit Plugin-System | Machbar, gutes Vorbild: Payload CMS Plugin-Architektur |
| Frei definierbare Course-Typen als Templates | Kernstück der App — braucht ein eigenes "Type-Schema-System" |
| Programs → Courses (1:n, versch. Typen) | Einfaches relationales Modell |
| Postgres für Fortschritt | Richtig, unstrittig |
| Postgres für Course-Inhalte selbst | Auch richtig — siehe Abschnitt 4 (nicht MongoDB) |
| Login/Users/Permissions | Standard-RBAC, gut lösbar |
| Umfangreiche Settings | Konfigurationsschicht, ähnlich Payload/Strapi Admin-Config |
| MCP-Funktionen (später) | ClassroomIO macht das bereits produktiv (`@classroomio/mcp`) — guter Präzedenzfall |
| Docker, self-hosted, jede Instanz unabhängig | Passt zu Single-Tenant-Architektur, siehe Abschnitt 5 |

---

## 2. Architektur-Grundprinzip: Core + Module

Drei klar getrennte Schichten, angelehnt an das Payload-CMS-Plugin-Modell (Config rein, erweiterte Config raus):

```
┌─────────────────────────────────────────────────┐
│  MODULE (installierbar, an/abschaltbar)          │
│  z.B. Code-Execution-Modul, Foren, Gamification, │
│  Zertifikate, MCP-Server, Custom Course-Types    │
├─────────────────────────────────────────────────┤
│  CORE-APP                                        │
│  Dashboard · Programs · Courses · Course-Type-   │
│  Engine · Enrollments · Progress · Users/Roles/  │
│  Permissions · Settings · Modul-Registry          │
├─────────────────────────────────────────────────┤
│  PLATTFORM-SCHICHT                                │
│  Postgres · Auth · Storage (S3/MinIO) · Sandbox-  │
│  Execution-Service · Queue/Jobs (Redis)           │
└─────────────────────────────────────────────────┘
```

**Wie ein Modul technisch andockt** (Payload-Plugin-Pattern, auf dich übertragen):

Ein Modul ist ein Package, das eine Funktion exportiert, die die App-Config entgegennimmt und erweitert zurückgibt:

```ts
// module.ts eines Code-Execution-Moduls
export const codeExecutionModule: AppModule = {
  key: "code-execution",
  version: "1.0.0",
  register(config: AppConfig): AppConfig {
    return {
      ...config,
      courseTypes: [...config.courseTypes, softwareDevCourseType],
      permissions: [...config.permissions, "code:execute"],
      settingsPanels: [...config.settingsPanels, codeExecSettingsPanel],
      hooks: {
        ...config.hooks,
        onBlockSubmit: [...config.hooks.onBlockSubmit, runInSandbox],
      },
    };
  },
};
```

Das gibt dir genau das, was du willst: Core bleibt schlank, jedes Feature (auch "eigene" wie Flashcards) ist im Prinzip selbst ein Modul — nur die absoluten Basics (Auth, Programs/Courses-Grundgerüst, Type-Engine) sind wirklich Core und nicht deaktivierbar.

---

## 3. Domänenmodell: Programs, Courses, Course-Types

Deine Beschreibung ist schon fast das fertige Datenmodell:

```
Organization (1 pro Instanz, siehe Abschnitt 5)
  └─ Program            "Mathe"
       └─ Course         "Winkelberechnung"    (Typ: Markdown-Info)
       └─ Course         "Trigonometrie-Quiz"  (Typ: Flashcards)
       └─ Course         "Python-Grundlagen"   (Typ: Softwareentwicklung)

CourseType (Template, wiederverwendbar, org-weit)
  ├─ Schema: welche Content-Blöcke sind erlaubt, welche Felder haben sie
  ├─ Renderer: welche UI-Komponente zeigt den Block an
  ├─ Execution-Engine: wie wird eine Nutzer-Eingabe ausgewertet (statisch/quiz/code/manuell)
  └─ Progress-Regeln: was zählt als "abgeschlossen"
```

**Der entscheidende Design-Punkt:** Ein `CourseType` ist kein Code, sondern eine **Schema-Definition** (ähnlich Strapi/Payload Content-Types), plus eine Referenz auf eine Execution-Engine. Für die eingebauten Typen (Markdown-Info, Flashcards, Quiz) ist die Engine simpler nativer Code im Core. Für "komplett eigene, programmierbare" Typen (dein Wunsch) brauchst du zusätzlich einen **Custom-Type-Modus**: Fortgeschrittene Nutzer/du selbst können einen Typ als Modul schreiben (echter Code, s. Abschnitt 2), einfache Anpassungen (neue Felder, neue Reihenfolge) laufen über den Schema-Editor ohne Code.

Das ist ein Zwei-Stufen-System — und genau das macht "vollständig modular" praktisch machbar, statt dass jeder Typ ein volles Software-Modul sein muss:

| Stufe | Wer nutzt es | Wie |
|---|---|---|
| **Schema-Konfiguration** | Alle Admins/Trainer | Felder zusammenklicken (Text, Markdown, Multiple-Choice, Code-Block, Datei-Upload, ...) → Type entsteht ohne Code |
| **Custom-Engine-Modul** | Entwickler (du) | Neues Modul mit eigener Execution-Logik, z.B. Compiler-Feedback für Softwareentwicklungs-Aufgaben |

---

## 4. Datenbank: Postgres ist richtig — mit Hybrid-Ansatz

Deine Unsicherheit ist berechtigt, aber die Lösung ist **nicht** "SQL raus, Dokument-DB rein". Der Grund: Nutzer, Rollen, Permissions, Enrollments, Progress — das ist zutiefst relational, braucht Foreign Keys, Transaktionen und Konsistenz (z.B. "Fortschritt darf nicht existieren ohne gültige Einschreibung"). Eine zweite Datenbank (Mongo o.ä.) nur für Course-Inhalte bedeutet: zwei Systeme in einem self-hosted Docker-Stack betreiben, zwei Backup-Strategien, keine plattformübergreifenden Transaktionen. Für eine App, die möglichst einfach von Einzelpersonen selbst gehostet werden soll, ist das ein echter Nachteil.

**Die Lösung, die Strapi/Payload/ClassroomIO alle in der einen oder anderen Form nutzen: Postgres + JSONB-Spalten für die variablen Teile.**

```sql
-- Feste, relationale Struktur
CREATE TABLE course_types (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),  -- NULL = System-Default-Typ
  key TEXT NOT NULL,                         -- 'markdown-info', 'flashcards', 'code-exercise'
  name TEXT NOT NULL,
  schema_definition JSONB NOT NULL,          -- welche Felder/Blocktypen sind erlaubt
  execution_engine TEXT NOT NULL,            -- 'static' | 'quiz' | 'sandbox' | 'custom:<module-key>'
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE courses (
  id UUID PRIMARY KEY,
  program_id UUID REFERENCES programs(id),
  course_type_id UUID REFERENCES course_types(id),
  title TEXT NOT NULL,
  config JSONB DEFAULT '{}',                 -- typ-spezifische Einstellungen (Bestehensgrenze etc.)
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE content_blocks (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  position INT NOT NULL,
  block_type TEXT NOT NULL,                  -- muss gegen course_types.schema_definition validiert werden
  content JSONB NOT NULL,                    -- der eigentliche Inhalt, Struktur je nach block_type
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fortschritt bleibt strikt relational (Integrität ist hier kritisch)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

CREATE TABLE block_progress (
  id UUID PRIMARY KEY,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  block_id UUID REFERENCES content_blocks(id),
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started | in_progress | done | failed
  attempts INT DEFAULT 0,
  score NUMERIC,
  submission_data JSONB,                      -- Antworten, Code-Einreichung, etc.
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Validierung:** `content` in `content_blocks` wird beim Speichern gegen `course_types.schema_definition` geprüft (JSON-Schema-Validierung, z.B. mit `zod` oder `ajv` in der App-Schicht — nicht in der DB). So bleibt die Datenbank simpel, die Business-Logik (welcher Typ erlaubt welche Felder) lebt im Code.

Postgres kann JSONB indizieren (GIN-Index) — Volltextsuche über Kursinhalte, Filtern nach Feldern im JSON etc. funktionieren gut genug für die Größenordnung, die ein selbstgehostetes Instance-Modell realistisch hat (Tausende, nicht Millionen Datensätze pro Instanz).

**Fazit zu deiner Frage:** Bleib bei einer Datenbank (Postgres). Der Fehler wäre nicht "SQL statt NoSQL", sondern "eine starre, vollständig normalisierte Tabelle pro Course-Typ" zu bauen — das würde bei jedem neuen Typ eine Migration erfordern und genau die Modularität kaputt machen, die du willst.

---

## 5. Multi-Tenant vs. Single-Tenant — die Antwort auf deine Frage

Kurz erklärt, dann die Empfehlung:

| | **Single-Tenant** (1 Instanz = 1 Organisation) | **Multi-Tenant** (1 Instanz = mehrere Organisationen) |
|---|---|---|
| Isolation | Physisch (eigener Docker-Stack, eigene DB) | Logisch (gleiche DB, `org_id`-Spalte oder Row-Level-Security) |
| Komplexität | Niedrig — jede Berechnung/Query braucht keinen Tenant-Filter | Hoch — jede Query muss korrekt gefiltert sein, sonst Datenleck zwischen Kunden |
| Passt zu "jede Instanz unabhängig" | **Ja, direkt** | Nein — widerspricht sich eigentlich mit deiner Anforderung |
| Sinnvoll wenn... | Jeder Nutzer/jede Firma hostet ihre eigene Instanz | Du selbst später eine gehostete SaaS-Version anbieten willst (1 Instanz, viele zahlende Kunden) |

**Deine eigene Anforderung** ("jede Instanz dieser App soll unabhängig funktionieren") beschreibt bereits Single-Tenant-per-Deployment — das ist auch architektonisch klar einfacher und für ein Docker-Self-Hosting-Produkt der richtige Standard-Fall (so macht es auch ClassroomIO).

**Trotzdem lohnt sich ein kleiner Kompromiss:** Baue eine `organizations`-Tabelle von Anfang an ein, auch wenn eine Instanz erstmal nur eine Zeile darin hat. Kostet fast nichts beim Bau, aber:
1. Falls du später doch eine gehostete SaaS-Variante anbieten willst (viele Selbstständige hosten nicht gern selbst), ist der Umbau zu Shared-Schema-Multi-Tenancy mit `org_id`-Spalten und Row-Level-Security nachträglich machbar, statt eine Kernannahme im ganzen Datenmodell umzureißen.
2. Innerhalb einer Instanz kannst du "Organisationseinheiten" (Abteilungen, Bereiche mit eigenen Berechtigungen) darüber abbilden, ohne echte Mandantentrennung zu brauchen — das ist ein anderes, kleineres Problem als Multi-Tenancy und du wirst es wahrscheinlich sowieso brauchen (z.B. Betrieb + Berufsschule als getrennte Bereiche in einer Instanz).

**Empfehlung: Single-Tenant pro Deployment, aber Schema so bauen, dass `org_id` überall vorhanden ist.** Kein aktives Multi-Tenant-Feature bauen, nur die Tür offen lassen.

---

## 6. Sandboxed Code-Execution — modular, aber sicher

Deine Anforderung: Code-Ausführung soll modular sein (im jeweiligen Course-Type-Modul definiert), aber grundsätzlich sandboxed. Die richtige Aufteilung:

- **Core stellt einen Sandbox-Execution-Service bereit** (eine interne API: "führe diesen Code in dieser Sprache mit diesen Eingaben aus, gib Output/Exit-Code/Fehler zurück").
- **Module rufen diesen Service auf**, statt selbst Sandboxing zu implementieren. So bleibt die Sicherheitskritische Komponente an einer Stelle wartbar, und trotzdem ist jeder Course-Typ frei darin, wie er das Ergebnis interpretiert (Unit-Test-Zähler, Ausgabe-Vergleich, Linting-Score, …).

**Technische Optionen für den Sandbox-Service, realistisch für Self-Hosting:**

| Option | Isolation | Aufwand Self-Hosting | Einschätzung |
|---|---|---|---|
| **Piston** (Open Source, self-hosted REST-API, 90+ Sprachen) | Container-basiert | Niedrig — ein Docker-Container | **Guter MVP-Start.** Ist quasi Industriestandard für Coding-Übungsplattformen/Judge-Systeme. |
| **Judge0** (Open Source) | Container-basiert | Mittel | Alternative zu Piston, ähnliches Modell, hatte in der Vergangenheit dokumentierte Sandbox-Escape-CVEs — Patches im Blick behalten. |
| **gVisor** (User-Space-Kernel) | Stärker als reiner Container | Mittel | Guter nächster Schritt, wenn du mehr Sicherheit willst als reines Docker, aber nicht die volle VM-Komplexität. |
| **Firecracker/Kata-MicroVMs** | Hardware-Virtualisierung, stärkste Isolation | Hoch — braucht KVM, eigene Orchestrierung | Overkill für den Start; relevant erst, wenn viele gleichzeitige, komplett fremde Nutzer Code einreichen (z.B. öffentliche Plattform mit vielen unbekannten Usern). |

**Empfehlung für dich:** Start mit **Piston self-hosted** als eigener Container im Docker-Compose-Stack. Es deckt genau deinen Fall ab (Azubis reichen Code für Aufgaben ein, kein öffentlich-feindlicher Traffic), ist simpel zu betreiben und lässt sich später hinter eine gVisor-Isolationsschicht stellen, ohne dass sich die Modul-Schnittstelle ändert — der Sandbox-Service bleibt nach außen gleich, nur die Implementierung dahinter wird härter.

Wichtig: Ressourcenlimits (CPU/Memory/Timeout) und Netzwerk-Isolation (kein Internetzugriff aus der Sandbox) von Anfang an hart konfigurieren, unabhängig davon welches Tool du nutzt.

---

## 7. Tech-Stack — Antwort auf deine Frage nach Alternativen

React/Node ist keine schlechte Wahl — du kennst es bereits (deine FIAE-Lernplattform lief ja schon auf React), und für dieses Projekt zählt Entwicklungsgeschwindigkeit mehr als jedes Performance-Prozent. Trotzdem hier die ehrliche Einordnung der Alternativen, Stand 2026:

| Framework | Stärke | Für dein Projekt |
|---|---|---|
| **Next.js** (React) | Größtes Ökosystem, React Server Components für contentlastige Dashboards, direkte Basis für Payload-CMS-artige Architektur | **Empfehlung.** Du kennst React bereits, riesiges Ökosystem an Auth/Admin-Panel-Bausteinen, passt zum Payload-Plugin-Vorbild aus Abschnitt 2. |
| **SvelteKit** | Kleinere Bundles, einfachere Reaktivität, das, was ClassroomIO selbst nutzt | Objektiv "schlanker", aber: kleineres Ökosystem, du müsstest React-Wissen nicht wiederverwenden. Lohnt sich nur, wenn dir Bundle-Size/Performance wichtiger ist als Wiederverwendung deines Wissens. |
| **Nuxt** (Vue) | Bestes Modul-Ökosystem von allen dreien | Kein Vue-Vorwissen bei dir — kein Vorteil. |

**Backend:** Bleib bei Node.js, aber strukturiere von Anfang an modular:
- **Next.js API-Routes / Route-Handlers** reichen für die meiste Business-Logik, wenn du Full-Stack-Next.js fährst (spart einen zweiten Deploy-Prozess im Docker-Stack).
- Für die Modul-Registry und komplexere Permission-Logik lohnt sich ein sauber getrenntes Backend-Package (z.B. mit **NestJS**, das von Haus aus ein Modul-System mitbringt, was thematisch zu deiner Anforderung passt) — optional, kein Muss für den Start.
- **ORM:** Drizzle (typsicher, sehr nah an SQL, gut für JSONB-Spalten) oder Prisma (komfortabler, etwas mehr Abstraktion). Für dein Hybrid-Schema mit viel JSONB tendiere ich zu **Drizzle**.

**Fazit:** Kein Wechsel nötig. Next.js + Node/TypeScript + Postgres + Drizzle ist ein solider, gut dokumentierter, self-hosting-freundlicher Stack, der genau zu deinem Vorwissen passt.

---

## 8. Rollen & Permissions

Klassisches RBAC reicht für den Start, granular genug aufgebaut, dass es später zu ABAC (attributbasiert, z.B. "nur Trainer *dieses* Programms") erweiterbar ist:

```
Permission  := "courses:create" | "courses:edit:own" | "courses:edit:any"
             | "users:manage" | "settings:manage" | "code:execute" | ...
Role        := Name + Liste von Permissions
User        := hat 1..n Rollen (global oder pro Program/Course-Scope)
```

Wichtig für dein Modul-System: **Module können eigene Permissions registrieren** (siehe `codeExecutionModule` Beispiel in Abschnitt 2, `"code:execute"`). Die Rollen-UI in den Settings muss also dynamisch alle registrierten Permissions aus allen aktiven Modulen anzeigen, nicht eine feste Liste.

---

## 9. Weitere Funktionen — Ausbau-Vorschläge

Dinge, die in deiner Beschreibung noch nicht vorkamen, aber für ein ernsthaftes LMS wichtig werden:

- **Zertifikate & Abschlussregeln** als eigenes Modul, das an beliebige Course-Types andockt ("wenn alle Blöcke `done` UND Score ≥ X → Zertifikat ausstellen")
- **Benachrichtigungen** (In-App, optional E-Mail) — neue Aufgabe, Feedback erhalten, Deadline nah
- **Foren/Diskussionen pro Kurs** — ClassroomIO hat das bereits, guter Vergleichspunkt
- **Content-Versionierung von Course-Types** — wenn du einen Typ nachträglich änderst, dürfen bestehende Kurse mit der alten Version nicht brechen (`schema_definition` + `version`-Feld siehst du oben bereits vor)
- **Import/Export von Course-Types & Courses als JSON-Paket** — macht Typen zwischen Instanzen teilbar (Community-Marketplace-Idee für später, ähnlich Strapi-Marketplace)
- **REST/GraphQL-API + Webhooks** — für Automatisierung und spätere Integrationen, macht die App auch für andere Tools anschlussfähig
- **Audit-Log** — bei granularen Permissions unverzichtbar, um nachzuvollziehen wer was geändert hat
- **Mehrsprachigkeit (i18n)** — gerade bei Ausbildungsinhalten evtl. relevant
- **Analytics-Dashboard** — Fortschritt, Drop-off-Rate pro Block, Zeit pro Lektion; gibt Trainern echten Mehrwert
- **Backup/Restore-Tooling** — bei "jede Instanz unabhängig" trägst du als Self-Hoster die Verantwortung, ein sauberes `pg_dump`/Restore-Skript im Docker-Stack ist Pflicht, kein Nice-to-have
- **White-Labeling/Theming pro Instanz** — passt zu deiner bestehenden Design-Sprache (Dark-Terminal/Electric-Aqua), als konfigurierbares Theme statt Hardcoding

**Zu MCP:** Zwei Richtungen sind sinnvoll und unterscheiden sich klar:
1. **Instanz exponiert einen MCP-Server** (wie ClassroomIO es mit `@classroomio/mcp` bereits produktiv macht) — externe KI-Assistenten (auch Claude) können Kurse, Fortschritt, Einschreibungen abfragen/verwalten.
2. **Course-Content nutzt MCP-Tools innerhalb einer Lektion** — z.B. ein "KI-Tutor"-Blocktyp, der während einer Übung selbst Tools aufruft (Code ausführen, Nachschlagen). Das ist deutlich komplexer und gehört klar in eine spätere Phase.

---

## 10. Realistische Roadmap

Ehrliche Einschätzung vorweg: Das Gesamtkonzept ist größer als ein einzelnes Ausbildungsprojekt — eher ein mehrmonatiges Nebenprojekt mit klaren Phasen. Wichtig ist, früh eine benutzbare Version zu haben, statt lange am "perfekten" modularen Fundament zu bauen.

**Phase 0 — Fundament** *(2–4 Wochen)*
- Next.js + Postgres + Drizzle Grundgerüst, Docker-Compose-Skeleton (App, Postgres, Redis, MinIO)
- Auth (Login, Sessions), Basis-Rollenmodell (Admin/Trainer/Lernender)
- `organizations`, `users`, `roles`, `permissions` Tabellen

**Phase 1 — Core MVP** *(4–8 Wochen)*
- Home Dashboard (eigene + zugewiesene Kurse, Fortschrittsübersicht)
- Programs & Courses CRUD
- **2–3 fest eingebaute Course-Types** (Markdown-Info, Flashcards, einfaches Quiz) — bewusst noch ohne generisches Type-Schema-System, um schnell etwas Nutzbares zu haben
- Enrollments & Progress-Tracking
- Settings-Grundgerüst (ein zentraler Ort, erstmal nur Kern-Einstellungen)

**Phase 2 — Modul-System & Type-Engine** *(4–6 Wochen)*
- Generisches `course_types.schema_definition` + Validierung
- Type-Editor-UI (Felder zusammenstellen, ohne Code)
- Modul-Registry (Payload-Plugin-Pattern aus Abschnitt 2), erste eigene Module (die Phase-1-Typen werden zu Modulen umgebaut — guter Realitätscheck der Architektur)
- Permissions werden dynamisch aus Modulen zusammengesetzt

**Phase 3 — Code-Execution-Modul** *(3–5 Wochen)*
- Sandbox-Service (Piston self-hosted) im Docker-Stack
- Course-Type "Softwareentwicklung" mit Testfall-Feedback
- Ressourcen-/Netzwerklimits hart konfiguriert

**Phase 4 — Ausbau** *(laufend, nach Bedarf priorisieren)*
- Zertifikate, Foren, Notifications, Analytics-Dashboard, Audit-Log, i18n

**Phase 5 — MCP & Integrationen** *(später)*
- MCP-Server für die Instanz
- REST/Webhook-API
- Optional: KI-gestützte Content-Erstellung im Type-Editor

**Phase 6 — Self-Hosting-Reife**
- Backup/Restore-Tooling, Update-Mechanismus zwischen Versionen, Dokumentation für andere Self-Hoster, ggf. Community-Marketplace für Course-Types

**Wichtigster Rat:** Baue Phase 1 **bewusst mit hartcodierten Course-Types**, nicht sofort mit dem vollen generischen Schema-System. Sonst besteht das Risiko, Monate am "perfekt modularen Fundament" zu bauen, ohne dass je ein Kurs benutzbar ist — ein klassisches Overengineering-Risiko bei genau dieser Art von Architektur-Ambition.

---

## 11. Nächste Schritte

1. Entscheiden: Next.js-Monolith (App + API zusammen) oder getrenntes Backend-Package von Anfang an?
2. Datenbankschema aus Abschnitt 4 als Drizzle-Schema ausformulieren
3. Docker-Compose-Skeleton für Phase 0 aufsetzen
4. Ersten hartcodierten Course-Type (z.B. Markdown-Info) End-to-End durchbauen, um das Grundgerüst zu validieren

---

*Kurzer Hinweis:* Dieses Dokument eignet sich gut als lebendige Referenz für den weiteren Aufbau — wenn du in kommenden Chats an einzelnen Phasen weiterarbeitest, lohnt es sich, jeweils kurz auf den passenden Abschnitt hier zu verweisen, statt den Kontext neu zu erklären.
