import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getConfig, getCourseTypeModule } from './app-config';

test('getConfig().courseTypes enthält alle drei Basis-Module nach Registrierung', () => {
  const config = getConfig();
  const keys = config.courseTypes.map((courseType) => courseType.key).sort();
  assert.deepEqual(keys, ['flashcards', 'markdown-info', 'quiz']);
});

test('getCourseTypeModule() findet einen registrierten Course-Type über den Key', () => {
  const markdownInfo = getCourseTypeModule('markdown-info');
  assert.ok(markdownInfo);
  assert.equal(markdownInfo?.name, 'Markdown-Info');
  assert.equal(typeof markdownInfo?.renderer, 'function');
  assert.equal(typeof markdownInfo?.editor, 'function');
});

test('getCourseTypeModule() gibt undefined für unbekannten Key zurück', () => {
  assert.equal(getCourseTypeModule('unknown-type'), undefined);
});
