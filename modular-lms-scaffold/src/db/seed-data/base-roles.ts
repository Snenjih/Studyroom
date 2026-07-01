// System-Basis-Rollen für neue Organisationen. Wird vom Seed-Skript (T008)
// konsumiert, um Zeilen in `roles` anzulegen.
export const BASE_ROLES = [
  { name: 'admin', description: 'Vollzugriff auf alle Verwaltungsfunktionen der Organisation' },
  { name: 'trainer', description: 'Erstellt und verwaltet Programme, Kurse und Inhalte' },
  { name: 'learner', description: 'Nimmt an zugewiesenen Kursen teil, verfolgt eigenen Fortschritt' },
] as const;
