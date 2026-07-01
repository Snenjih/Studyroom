import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

// Placeholder-Tabelle als Smoke-Test für T003. Wird in T004 durch die
// tatsächlichen Kern-Tabellen (organizations, users) ersetzt.
export const healthCheck = pgTable('health_check', {
  id: uuid('id').primaryKey().defaultRandom(),
  checkedAt: timestamp('checked_at', { withTimezone: true }).notNull().defaultNow(),
});
