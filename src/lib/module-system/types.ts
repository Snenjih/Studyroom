import type { ComponentType } from 'react';

import type { CourseTypeSchemaDefinition } from '@/db/schema/course-types';

// Kanonische Definition der Renderer/Editor-Props für Course-Type-Module (Konzept
// Abschnitt 2/3). Vorher in `src/lib/course-type-registry.ts` (T018), das mit T025
// durch dieses Modul-System ersetzt wird.
export type BlockProgressStatus = 'not_started' | 'in_progress' | 'done' | 'failed';

export interface BlockProgressSummary {
  status: BlockProgressStatus;
  score: string | null;
  submissionData: unknown;
}

export interface RecordProgressInput {
  status: BlockProgressStatus;
  score?: number;
  submissionData?: unknown;
}

export interface BlockRendererProps {
  content: Record<string, unknown>;
  blockId: string;
  enrollmentId: string;
  progress: BlockProgressSummary | null;
  onComplete: (input: RecordProgressInput) => Promise<void>;
}

export interface BlockEditorProps {
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}

// Ein von einem Modul registrierter Course-Type (Konzept Abschnitt 2/3). `schemaDefinition`
// nutzt vorerst das bestehende Format aus `db/schema/course-types.ts` — T026 formalisiert
// dieses Format weiter, ohne diese Struktur hier zu brechen.
export interface CourseTypeModuleDefinition {
  key: string;
  name: string;
  executionEngine: string;
  schemaDefinition: CourseTypeSchemaDefinition;
  renderer: ComponentType<BlockRendererProps>;
  editor: ComponentType<BlockEditorProps>;
}

// Permission, die ein Modul zusätzlich zu den Core-Permissions registriert
// (Konzept Abschnitt 8, z.B. Code-Execution-Modul registriert "code:execute").
export interface PermissionDefinition {
  key: string;
  description?: string;
}

// Platzhalter für Modul-eigene Settings-Panels (Konzept Abschnitt 2). Kein Modul in
// dieser Phase registriert bereits eines — Struktur liegt aber schon fest.
export interface SettingsPanel {
  key: string;
  label: string;
  component: ComponentType;
}

export type Hook<T = unknown> = (input: T) => Promise<void> | void;

export interface AppHooks {
  onBlockSubmit: Hook[];
}

// Die vom Core aufgelöste Gesamt-Konfiguration, entsteht durch nacheinander
// angewendete `AppModule.register()`-Aufrufe (Konzept Abschnitt 2, Payload-Plugin-Pattern).
export interface AppConfig {
  courseTypes: CourseTypeModuleDefinition[];
  permissions: PermissionDefinition[];
  settingsPanels: SettingsPanel[];
  hooks: AppHooks;
}

// Ein Modul ist ein Package, das eine Funktion exportiert, die die App-Config
// entgegennimmt und erweitert zurückgibt (Konzept Abschnitt 2).
export interface AppModule {
  key: string;
  version: string;
  register(config: AppConfig): AppConfig;
}

export function createBaseConfig(): AppConfig {
  return {
    courseTypes: [],
    permissions: [],
    settingsPanels: [],
    hooks: { onBlockSubmit: [] },
  };
}
