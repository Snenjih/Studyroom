import type { AppModule } from '@/lib/module-system';
import { flashcardsModule } from '@/modules/course-types/flashcards';
import { markdownInfoModule } from '@/modules/course-types/markdown-info';
import { quizModule } from '@/modules/course-types/quiz';

// Katalog aller installierbaren Module (Konzept Abschnitt 2: "an/abschaltbar") — auch
// deaktivierte Module bleiben hier gelistet, damit die Settings-Seite sie anzeigen kann,
// ohne dass sie in der ModuleRegistry registriert sind.
export const AVAILABLE_MODULES: AppModule[] = [markdownInfoModule, flashcardsModule, quizModule];

const DEFAULT_ENABLED_MODULE_KEYS = AVAILABLE_MODULES.map((module) => module.key);

// Welche Module beim App-Start tatsächlich registriert werden, bestimmt die
// `ENABLED_MODULES`-Umgebungsvariable (kommagetrennte Keys) — fehlt sie, sind alle
// bekannten Module aktiv. Bewusst rein synchron/env-basiert (keine DB-Abfrage): diese
// Datei wird von `src/lib/rbac.ts` importiert, um Permissions inaktiver Module bei
// jedem Berechtigungs-Check live auszufiltern (nicht nur beim seltener laufenden
// DB-Abgleich in `lib/db/permissions.ts`) — ein DB-Zugriff hier würde diesen
// Hot-Path unnötig verlangsamen. `app-config.ts` (server-only) nutzt dieselbe
// Funktion, um zu entscheiden, welche Module in der ModuleRegistry landen.
// `env` als Parameter (statt direkt `process.env` zu lesen) macht die Funktion ohne
// Env-Mutation testbar.
export function parseEnabledModuleKeys(env: string | undefined = process.env.ENABLED_MODULES): string[] {
  if (env === undefined) return DEFAULT_ENABLED_MODULE_KEYS;
  return env
    .split(',')
    .map((key) => key.trim())
    .filter(Boolean);
}

export const ENABLED_MODULE_KEYS: string[] = parseEnabledModuleKeys();

export function isModuleEnabled(
  key: string,
  enabledKeys: string[] = ENABLED_MODULE_KEYS,
): boolean {
  return enabledKeys.includes(key);
}

export function getEnabledModules(enabledKeys: string[] = ENABLED_MODULE_KEYS): AppModule[] {
  return AVAILABLE_MODULES.filter((module) => isModuleEnabled(module.key, enabledKeys));
}
