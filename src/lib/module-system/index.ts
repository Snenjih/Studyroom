import { ModuleRegistry } from './registry';

// Singleton-Instanz: `src/app-config.ts` registriert hier alle aktiven Module,
// der Rest der App liest die aufgelöste Config ausschließlich über diese Instanz.
export const moduleRegistry = new ModuleRegistry();

export * from './registry';
export * from './types';
