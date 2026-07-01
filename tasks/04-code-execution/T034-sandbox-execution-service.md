# T034: Sandbox-Execution-Service-Schnittstelle

**Phase:** 04-code-execution
**Status:** offen
**Abhängig von:** T033

## Kontext
Konzept Abschnitt 6: "Core stellt einen Sandbox-Execution-Service bereit — Module rufen
diesen Service auf." Die Schnittstelle bleibt stabil, auch wenn Piston später durch
gVisor ersetzt wird.

## Ziel
Ein interner Execution-Service abstrahiert Piston hinter einer stabilen TypeScript-API.
Module rufen `executeCode()` auf, nicht direkt die Piston-API.

## Schritte
- [ ] `src/lib/execution/types.ts` — `ExecutionRequest`, `ExecutionResult` Interfaces:
      `{ language, code, stdin?, timeout }` → `{ stdout, stderr, exitCode, timedOut }`
- [ ] `src/lib/execution/piston-client.ts` — HTTP-Client für Piston-API
- [ ] `src/lib/execution/sandbox.ts` — `executeCode(request): ExecutionResult`
      (delegiert an Piston-Client, handhabt Timeouts und Netzwerkfehler)
- [ ] `src/app/api/execution/route.ts` — interner Endpoint (nicht öffentlich!):
      Permission `code:execute` erforderlich
- [ ] Error-Types: `ExecutionError`, `TimeoutError`, `LanguageNotSupportedError`

## Abnahmekriterien
- [ ] `executeCode({ language: 'python', code: 'print(42)' })` gibt `{ stdout: '42\n', exitCode: 0 }`
- [ ] Timeout nach konfigurierbarer Zeit (default 10s) gibt `{ timedOut: true }`
- [ ] Piston-Ausfall gibt `ExecutionError` (kein unbehandelter 500)
- [ ] Interface `ExecutionResult` ist stabil — Modul-Code referenziert nie Piston direkt

## Betroffene Dateien
- `src/lib/execution/types.ts`, `piston-client.ts`, `sandbox.ts` (neu)
- `src/app/api/execution/route.ts` (neu)

## Notizen
