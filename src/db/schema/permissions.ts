import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { rolePermissions } from './role-permissions';

export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  description: text('description'),
  moduleKey: text('module_key'),
  // Wird beim Abgleich mit der Modul-Registry gesetzt (T030), wenn ein Modul, das
  // diese Permission registriert hat, nicht mehr aktiv ist. Zeile bleibt erhalten
  // (Fremdschlüssel aus role_permissions), taucht aber nicht mehr als zuweisbar auf.
  deprecated: boolean('deprecated').notNull().default(false),
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));
