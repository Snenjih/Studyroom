import 'server-only';

import { getSetting, setSetting } from '@/lib/settings';

const SETTINGS_KEY = 'disabledModuleKeys';

// Persistiert, welche Module ein Admin über die Settings-UI deaktivieren möchte
// (T031). Wirkt NICHT sofort auf die laufende ModuleRegistry — die tatsächliche
// Aktivierung liest `src/config/modules.config.ts` synchron aus `ENABLED_MODULES`
// beim Prozessstart. Diese Tabelle ist der "gewünschte Ziel-Zustand", den ein Admin
// als Nächstes in die Umgebungsvariable übernehmen und die App neu starten muss —
// siehe Notizen in T031-Task-Datei für die Begründung dieser Trennung.
export async function getRequestedDisabledModuleKeys(orgId: string): Promise<string[]> {
  const stored = await getSetting<string[]>(orgId, SETTINGS_KEY);
  return stored ?? [];
}

export async function setModuleRequestedEnabled(
  orgId: string,
  moduleKey: string,
  enabled: boolean,
): Promise<void> {
  const current = await getRequestedDisabledModuleKeys(orgId);
  const next = enabled
    ? current.filter((key) => key !== moduleKey)
    : Array.from(new Set([...current, moduleKey]));
  await setSetting(orgId, SETTINGS_KEY, next);
}
