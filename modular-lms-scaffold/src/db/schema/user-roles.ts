import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

import { roles } from './roles';
import { users } from './users';

export const userRoles = pgTable(
  'user_roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    // NULL scopeType/scopeId = global (org-weite) Rollenzuweisung.
    // Gesetzt z.B. auf 'program'/<program_id> oder 'course'/<course_id> für
    // Program- bzw. Course-spezifische Rollen (Konzept Abschnitt 8).
    scopeType: text('scope_type'),
    scopeId: uuid('scope_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.userId, table.roleId, table.scopeType, table.scopeId)],
);

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));
