import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ModuleRegistry } from './registry';
import type { AppModule } from './types';

function fakeCourseTypeModule(key: string): AppModule {
  return {
    key,
    version: '1.0.0',
    register(config) {
      return {
        ...config,
        courseTypes: [
          ...config.courseTypes,
          {
            key,
            name: key,
            executionEngine: 'static',
            schemaDefinition: { allowedBlockTypes: [] },
            renderer: () => null,
            editor: () => null,
          },
        ],
      };
    },
  };
}

test('getConfig() ohne registrierte Module liefert die leere Basis-Config', () => {
  const registry = new ModuleRegistry();
  const config = registry.getConfig();
  assert.deepEqual(config.courseTypes, []);
  assert.deepEqual(config.permissions, []);
  assert.deepEqual(config.settingsPanels, []);
  assert.deepEqual(config.hooks.onBlockSubmit, []);
});

test('register() ruft module.register(config) auf und akkumuliert die Config', () => {
  const registry = new ModuleRegistry();
  registry.register(fakeCourseTypeModule('a'));
  registry.register(fakeCourseTypeModule('b'));

  const config = registry.getConfig();
  assert.equal(config.courseTypes.length, 2);
  assert.deepEqual(
    config.courseTypes.map((courseType) => courseType.key),
    ['a', 'b'],
  );
});

test('getModules() gibt alle registrierten Module in Registrierungsreihenfolge zurück', () => {
  const registry = new ModuleRegistry();
  const moduleA = fakeCourseTypeModule('a');
  const moduleB = fakeCourseTypeModule('b');
  registry.register(moduleA);
  registry.register(moduleB);

  assert.deepEqual(registry.getModules(), [moduleA, moduleB]);
});

test('register() mit bereits registriertem Modul-Key ist ein No-Op', () => {
  const registry = new ModuleRegistry();
  registry.register(fakeCourseTypeModule('a'));
  registry.register(fakeCourseTypeModule('a'));

  assert.equal(registry.getModules().length, 1);
  assert.equal(registry.getConfig().courseTypes.length, 1);
});
