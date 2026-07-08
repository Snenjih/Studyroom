import 'server-only';

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE = 'session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET ist nicht gesetzt');
}
const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export interface SessionPayload extends JWTPayload {
  userId: string;
  orgId: string;
}

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, orgId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await encrypt({ userId, orgId });
  const cookieStore = await cookies();
  const headerList = await headers();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // An `x-forwarded-proto: https`, nicht an NODE_ENV gekoppelt: Self-Hosting läuft
    // standardmäßig ohne eigenen Reverse-Proxy (siehe docker-compose.yml) über reines
    // HTTP, obwohl das Docker-Image mit NODE_ENV=production baut. Ein hartes
    // `secure: true` in diesem Fall führt dazu, dass Browser das Cookie nach dem
    // Login-Redirect stillschweigend verwerfen (Login wirkt erfolgreich, Sessions
    // greifen aber nie) — verwendet nur `x-forwarded-proto`, damit ein TLS-terminierender
    // Reverse-Proxy davor weiterhin `secure: true` aktiviert.
    secure: headerList.get('x-forwarded-proto') === 'https',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return decrypt(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
