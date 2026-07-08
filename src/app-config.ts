import 'server-only';

import { getEnabledModules } from '@/config/modules.config';
import { moduleRegistry } from '@/lib/module-system';

// Root-Konfiguration der App (Konzept Abschnitt 2). Nur die laut `modules.config.ts`
// (T031) aktiven Module werden registriert. `getConfig()`/`getCourseTypeModule()` sind
// der einzige Weg, an die aufgelöste Gesamt-Konfiguration bzw. einen einzelnen
// Course-Type-Eintrag zu kommen — ersetzt das alte `courseTypeRegistry` (T018).
// `server-only` ist HIER absichtlich (T031-Bugfix): `ENABLED_MODULES` ist im
// Client-Bundle unsichtbar (nur `NEXT_PUBLIC_*`-Vars sind es), ein Import aus einer
// Client-Komponente führt sonst zu Server/Client-Hydration-Mismatches statt zu einem
// klaren Build-/Import-Fehler. Komponenten, die eine registrierte Editor/Renderer-
// Referenz brauchen, bekommen sie von einer Server-Komponente als Prop durchgereicht
// (siehe `BlockList.tsx`), statt `app-config.ts` selbst zu importieren.
for (const appModule of getEnabledModules()) {
  moduleRegistry.register(appModule);
}

export function getConfig() {
  return moduleRegistry.getConfig();
}

export function getCourseTypeModule(key: string) {
  return getConfig().courseTypes.find((courseType) => courseType.key === key);
}
