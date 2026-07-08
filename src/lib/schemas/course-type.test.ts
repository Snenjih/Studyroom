import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createCourseTypeSchema, toFieldDefinition } from './course-type';

test('createCourseTypeSchema lehnt weniger als 2 Felder ab', () => {
  const result = createCourseTypeSchema.safeParse({
    key: 'test-type',
    name: 'Test',
    fields: [{ name: 'only-one', type: 'text', required: true }],
  });
  assert.equal(result.success, false);
});

test('createCourseTypeSchema lehnt ungültigen Key ab', () => {
  const result = createCourseTypeSchema.safeParse({
    key: 'Not A Valid Key!',
    name: 'Test',
    fields: [
      { name: 'a', type: 'text', required: true },
      { name: 'b', type: 'text', required: true },
    ],
  });
  assert.equal(result.success, false);
});

test('createCourseTypeSchema lehnt select-Felder mit weniger als 2 Optionen ab', () => {
  const result = createCourseTypeSchema.safeParse({
    key: 'test-type',
    name: 'Test',
    fields: [
      { name: 'a', type: 'select', required: true, options: 'nur-eine' },
      { name: 'b', type: 'text', required: true },
    ],
  });
  assert.equal(result.success, false);
});

test('createCourseTypeSchema akzeptiert einen validen Entwurf', () => {
  const result = createCourseTypeSchema.safeParse({
    key: 'projekt-reflexion',
    name: 'Projekt-Reflexion',
    fields: [
      { name: 'titel', type: 'text', required: true },
      { name: 'bewertung', type: 'select', required: true, options: 'gut, ok, schlecht' },
    ],
  });
  assert.equal(result.success, true);
});

test('toFieldDefinition() wandelt select-Zeile mit geparsten Optionen um', () => {
  const field = toFieldDefinition({
    name: 'bewertung',
    type: 'select',
    required: true,
    options: ' gut , ok ,schlecht ',
  });
  assert.deepEqual(field, {
    name: 'bewertung',
    required: true,
    type: 'select',
    options: ['gut', 'ok', 'schlecht'],
  });
});

test('toFieldDefinition() wandelt array-Zeile mit itemType um (Default: text)', () => {
  const withDefault = toFieldDefinition({ name: 'tags', type: 'array', required: false });
  assert.deepEqual(withDefault, { name: 'tags', required: false, type: 'array', itemType: 'text' });

  const withNumber = toFieldDefinition({
    name: 'scores',
    type: 'array',
    required: false,
    itemType: 'number',
  });
  assert.deepEqual(withNumber, {
    name: 'scores',
    required: false,
    type: 'array',
    itemType: 'number',
  });
});

test('toFieldDefinition() wandelt einfache Feld-Typen ohne Extra-Constraints um', () => {
  assert.deepEqual(toFieldDefinition({ name: 'a', type: 'text', required: true }), {
    name: 'a',
    required: true,
    type: 'text',
  });
  assert.deepEqual(toFieldDefinition({ name: 'b', type: 'number', required: false }), {
    name: 'b',
    required: false,
    type: 'number',
  });
});
