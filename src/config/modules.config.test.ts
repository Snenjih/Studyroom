import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ModuleRegistry } from '@/lib/module-system';

import {
  AVAILABLE_MODULES,
  getEnabledModules,
  isModuleEnabled,
  parseEnabledModuleKeys,
} from './modules.config';

test('parseEnabledModuleKeys() ohne ENABLED_MODULES aktiviert alle bekannten Module', () => {
  const keys = parseEnabledModuleKeys(undefined);
  assert.deepEqual(
    keys.sort(),
    AVAILABLE_MODULES.map((module) => module.key).sort(),
  );
});

test('parseEnabledModuleKeys() parst eine kommagetrennte Liste', () => {
  assert.deepEqual(parseEnabledModuleKeys('quiz, flashcards'), ['quiz', 'flashcards']);
});

test('parseEnabledModuleKeys() mit leerem String aktiviert kein Modul', () => {
  assert.deepEqual(parseEnabledModuleKeys(''), []);
});

test('isModuleEnabled() prüft gegen die übergebene Liste aktivierter Keys', () => {
  assert.equal(isModuleEnabled('quiz', ['quiz', 'flashcards']), true);
  assert.equal(isModuleEnabled('markdown-info', ['quiz', 'flashcards']), false);
});

test('getEnabledModules() filtert AVAILABLE_MODULES auf die aktivierten Keys (Abnahmekriterium T031: deaktiviertes Modul verschwindet)', () => {
  const enabled = getEnabledModules(['quiz']);
  assert.deepEqual(
    enabled.map((module) => module.key),
    ['quiz'],
  );

  const noneEnabled = getEnabledModules([]);
  assert.deepEqual(noneEnabled, []);
});

test('ein deaktiviertes Modul registriert seinen CourseType nicht in einer frischen Registry (Abnahmekriterium T031)', () => {
  const registry = new ModuleRegistry();
  // "quiz" bewusst deaktiviert lassen, wie ein Admin es über ENABLED_MODULES täte.
  for (const appModule of getEnabledModules(['markdown-info', 'flashcards'])) {
    registry.register(appModule);
  }

  const config = registry.getConfig();
  const courseTypeKeys = config.courseTypes.map((courseType) => courseType.key);
  assert.ok(courseTypeKeys.includes('markdown-info'));
  assert.ok(courseTypeKeys.includes('flashcards'));
  assert.ok(!courseTypeKeys.includes('quiz'));
});
