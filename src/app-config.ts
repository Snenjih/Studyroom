import { moduleRegistry } from '@/lib/module-system';

// Root-Konfiguration der App (Konzept Abschnitt 2). Module registrieren sich hier;
// welche Course-Types/Module tatsächlich aktiv sind, wird ab T025 hier ergänzt.
// `getConfig()` ist der einzige Weg, an die aufgelöste Gesamt-Konfiguration zu kommen.

export function getConfig() {
  return moduleRegistry.getConfig();
}
