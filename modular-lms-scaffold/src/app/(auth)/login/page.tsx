'use client';

import { useActionState } from 'react';

import { login } from './actions';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950">
      <form
        action={formAction}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-8"
      >
        <h1 className="text-2xl font-bold text-white">Anmelden</h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-zinc-400">
            E-Mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-zinc-400">
            Passwort
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </div>
        {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-white px-4 py-2 font-medium text-zinc-950 disabled:opacity-50"
        >
          {pending ? 'Wird geprüft…' : 'Anmelden'}
        </button>
      </form>
    </main>
  );
}
