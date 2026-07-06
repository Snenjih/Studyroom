import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { organizations } from '@/db/schema';

export async function getOrganization(orgId: string) {
  const [org] = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
  return org ?? null;
}

export async function updateOrganizationName(orgId: string, name: string) {
  const [org] = await db
    .update(organizations)
    .set({ name })
    .where(eq(organizations.id, orgId))
    .returning();
  return org ?? null;
}
