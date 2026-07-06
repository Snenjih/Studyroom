import { relations } from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

import { organizations } from './organizations';

// Key-Value-Store für Org-Einstellungen (Konzept Abschnitt 10, T023) — kein festes
// Spaltenschema, damit spätere Module (Phase 3) eigene Settings-Keys ergänzen können,
// ohne eine Migration zu brauchen.
export const orgSettings = pgTable(
  'org_settings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    value: jsonb('value').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.orgId, table.key)],
);

export const orgSettingsRelations = relations(orgSettings, ({ one }) => ({
  organization: one(organizations, {
    fields: [orgSettings.orgId],
    references: [organizations.id],
  }),
}));
