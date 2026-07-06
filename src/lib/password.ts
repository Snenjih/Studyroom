import bcrypt from 'bcryptjs';

// Kein `server-only`-Import hier: wird auch vom Seed-Skript (`src/db/seed.ts`)
// außerhalb des Next.js-Build-Kontexts per tsx ausgeführt, wo `server-only` fehlschlägt.
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
