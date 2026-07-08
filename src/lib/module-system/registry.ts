import { type AppConfig, type AppModule, createBaseConfig } from './types';

// Wendet registrierte Module nacheinander auf die Basis-Config an (Konzept
// Abschnitt 2: "Core bleibt schlank, jedes Feature ist im Prinzip selbst ein Modul").
export class ModuleRegistry {
  private modules: AppModule[] = [];

  register(module: AppModule): void {
    this.modules.push(module);
  }

  getModules(): readonly AppModule[] {
    return this.modules;
  }

  getConfig(): AppConfig {
    return this.modules.reduce((config, module) => module.register(config), createBaseConfig());
  }
}
