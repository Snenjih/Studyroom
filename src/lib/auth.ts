import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { users } from '@/db/schema';

import { verifyPassword } from './password';

export interface AuthenticatedUser {
  id: string;
  orgId: string;
  email: string;
  name: string;
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<AuthenticatedUser | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) return null;

  const passwordMatches = await verifyPassword(password, user.passwordHash);
  if (!passwordMatches) return null;

  return { id: user.id, orgId: user.orgId, email: user.email, name: user.name };
}
