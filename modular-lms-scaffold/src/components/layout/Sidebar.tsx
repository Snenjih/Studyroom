'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { logout } from '@/app/actions';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/programs', label: 'Programs' },
  { href: '/settings', label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-800/70 bg-zinc-950">
      <div className="border-b border-zinc-800/70 px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.6)]" />
          <span className="font-mono text-sm font-semibold tracking-[0.3em] text-zinc-100">
            STUDYROOM
          </span>
        </div>
        <p className="mt-1 font-mono text-[11px] text-zinc-600">v0.1 — core-mvp</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2 rounded px-3 py-2 font-mono text-[13px] transition-colors ${
                isActive
                  ? 'bg-zinc-900 text-cyan-300'
                  : 'text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-200'
              }`}
            >
              <span
                className={`text-cyan-400 transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                }`}
              >
                ›
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logout} className="border-t border-zinc-800/70 px-3 py-4">
        <button
          type="submit"
          className="w-full rounded px-3 py-2 text-left font-mono text-[13px] text-zinc-500 transition-colors hover:bg-red-950/40 hover:text-red-300"
        >
          ← Abmelden
        </button>
      </form>
    </aside>
  );
}
