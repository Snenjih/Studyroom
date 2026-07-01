import { PERMISSIONS } from '@/lib/permissions';

// System-Basis-Rollen für neue Organisationen, inkl. Standard-Permission-Zuweisung
// (Konzept Abschnitt 8). Wird vom Seed-Skript (`src/db/seed.ts`) konsumiert.
export const BASE_ROLES = [
  {
    name: 'admin',
    description: 'Vollzugriff auf alle Verwaltungsfunktionen der Organisation',
    permissions: Object.values(PERMISSIONS),
  },
  {
    name: 'trainer',
    description: 'Erstellt und verwaltet Programme, Kurse und Inhalte',
    permissions: [PERMISSIONS.COURSES_CREATE, PERMISSIONS.COURSES_EDIT_OWN],
  },
  {
    name: 'learner',
    description: 'Nimmt an zugewiesenen Kursen teil, verfolgt eigenen Fortschritt',
    permissions: [],
  },
] as const;
