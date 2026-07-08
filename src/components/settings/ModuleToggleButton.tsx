'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface ModuleToggleButtonProps {
  moduleKey: string;
  requestedEnabled: boolean;
}

export function ModuleToggleButton({ moduleKey, requestedEnabled }: ModuleToggleButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/settings/modules/${moduleKey}/toggle`, { method: 'POST' });
      if (!response.ok) {
        setError('Fehler beim Umschalten.');
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3">
      {error && <span className="text-xs text-red-400">{error}</span>}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className="rounded border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:border-cyan-500/60 hover:text-cyan-300 disabled:opacity-50"
      >
        {isPending ? '…' : requestedEnabled ? 'Deaktivieren' : 'Aktivieren'}
      </button>
    </div>
  );
}
