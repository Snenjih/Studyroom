# T050: MCP-Server — Kurse, Programme und Fortschritt als Tools

**Phase:** 06-mcp-integration
**Status:** offen
**Abhängig von:** T049

## Kontext
Konzept Abschnitt 9: MCP-Server exponiert Kurse, Fortschritt und Einschreibungen für
externe KI-Assistenten (Richtung 1). Analog zu ClassroomIO `@classroomio/mcp`.

## Ziel
Ein KI-Assistent mit MCP-Verbindung kann Programme, Kurse und Lernfortschritt
eines Users abfragen.

## Schritte
- [ ] `src/mcp/tools/list-programs.ts` — Tool: gibt alle Programme der Org zurück
- [ ] `src/mcp/tools/list-courses.ts` — Tool: gibt Kurse eines Programms zurück
- [ ] `src/mcp/tools/get-course.ts` — Tool: Kursdetails inkl. Blöcke
- [ ] `src/mcp/tools/get-user-progress.ts` — Tool: Fortschritt eines Users in einem Kurs
- [ ] `src/mcp/tools/index.ts` — alle Tools bei Server registrieren
- [ ] Input-Schema für jedes Tool (Zod-basiert, MCP-SDK-konform)

## Abnahmekriterien
- [ ] `list-programs` gibt korrekte Programme der Org zurück
- [ ] `get-user-progress` gibt Block-Status pro Block zurück
- [ ] Tool-Aufrufe ohne nötige Parameter geben valide Fehlermeldung
- [ ] KI-Client (z.B. Claude via MCP) kann Tools aufrufen und Ergebnis parsen

## Betroffene Dateien
- `src/mcp/tools/` (neu)

## Notizen
