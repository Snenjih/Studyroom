import { requireSession } from '@/lib/session';

import { logout } from './actions';

export default async function Home() {
  const session = await requireSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950">
      <h1 className="text-4xl font-bold text-white">Studyroom</h1>
      <p className="text-zinc-400">Angemeldet als User {session.userId}</p>
      <form action={logout}>
        <button
          type="submit"
          className="rounded bg-white px-4 py-2 font-medium text-zinc-950"
        >
          Abmelden
        </button>
      </form>
    </main>
  );
}
