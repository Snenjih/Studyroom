'use client';

import { useActionState, useState } from 'react';

import type { SettingsFormState } from '@/app/(app)/settings/actions';

interface SettingsFormProps {
  action: (prevState: SettingsFormState, formData: FormData) => Promise<SettingsFormState>;
  defaultValues: {
    name: string;
    description: string;
    logoUrl: string | null;
  };
}

export function SettingsForm({ action, defaultValues }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [logoPreview, setLogoPreview] = useState<string | null>(defaultValues.logoUrl);

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  }

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="font-mono text-[11px] uppercase tracking-wider text-zinc-500"
        >
          Org-Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={defaultValues.name}
          required
          className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
        {state?.fieldErrors?.name && (
          <p className="text-sm text-red-400">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="font-mono text-[11px] uppercase tracking-wider text-zinc-500"
        >
          Beschreibung
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultValues.description}
          rows={4}
          className="resize-none rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
        {state?.fieldErrors?.description && (
          <p className="text-sm text-red-400">{state.fieldErrors.description[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">Logo</span>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-dashed border-zinc-700 bg-zinc-900/60">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Org-Logo" className="h-full w-full object-cover" />
            ) : (
              <span className="font-mono text-[10px] text-zinc-600">kein Logo</span>
            )}
          </div>
          <label
            htmlFor="logo"
            className="cursor-pointer rounded border border-zinc-700 px-3 py-2 font-mono text-[12px] text-zinc-300 transition-colors hover:border-cyan-500 hover:text-cyan-300"
          >
            Datei wählen…
            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
        </div>
        {state?.fieldErrors?.logoKey && (
          <p className="text-sm text-red-400">{state.fieldErrors.logoKey[0]}</p>
        )}
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && (
        <p className="font-mono text-[12px] text-cyan-400">✓ Einstellungen gespeichert</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded bg-cyan-400 px-5 py-2 font-medium text-zinc-950 transition-colors hover:bg-cyan-300 disabled:opacity-50"
      >
        {pending ? 'Speichern…' : 'Änderungen speichern'}
      </button>
    </form>
  );
}
