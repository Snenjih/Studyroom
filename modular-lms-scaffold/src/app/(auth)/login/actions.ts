'use server';

import { redirect } from 'next/navigation';

import { verifyCredentials } from '@/lib/auth';
import { createSession } from '@/lib/session';

export type LoginState = { error: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return { error: 'E-Mail und Passwort sind erforderlich.' };
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return { error: 'E-Mail oder Passwort ist falsch.' };
  }

  await createSession(user.id, user.orgId);
  redirect('/');
}
