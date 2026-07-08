import { type AppConfig, type AppModule, createBaseConfig } from './types';

// Wendet registrierte Module nacheinander auf die Basis-Config an (Konzept
// Abschnitt 2: "Core bleibt schlank, jedes Feature ist im Prinzip selbst ein Modul").
export class ModuleRegistry {
  private modules: AppModule[] = [];

  // Idempotent nach `module.key`: verhindert doppelte Registrierung, falls das
  // Root-Config-Modul (z.B. durch Dev-Server-Neuausführung) mehrfach importiert wird.
  register(module: AppModule): void {
    if (this.modules.some((existing) => existing.key === module.key)) return;
    this.modules.push(module);
  }

  getModules(): readonly AppModule[] {
    return this.modules;
  }

  getConfig(): AppConfig {
    return this.modules.reduce((config, module) => module.register(config), createBaseConfig());
  }
}
