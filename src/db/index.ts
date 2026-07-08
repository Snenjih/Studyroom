import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL ist nicht gesetzt');
}

const client = postgres(process.env.DATABASE_URL);

export const db = drizzle(client, { schema });

// Exportiert, damit Integrationstests (`*.integration.test.ts`) die Connection nach
// dem Testlauf schließen können — sonst hält der offene Pool den Node-Prozess am Leben.
export async function closeDb(): Promise<void> {
  await client.end();
}
