// Core-Permissions (module_key = NULL, siehe Konzept Abschnitt 4 & 8). Modul-eigene
// Permissions (z.B. "code:execute") werden erst mit dem Modul-System (Phase 3) und
// dessen Modulen selbst registriert, nicht hier.
export const PERMISSIONS = {
  PROGRAMS_MANAGE: 'programs:manage',
  COURSES_CREATE: 'courses:create',
  COURSES_MANAGE: 'courses:manage',
  COURSES_EDIT_OWN: 'courses:edit:own',
  COURSES_EDIT_ANY: 'courses:edit:any',
  USERS_MANAGE: 'users:manage',
  SETTINGS_MANAGE: 'settings:manage',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
