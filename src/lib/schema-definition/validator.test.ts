import assert from 'node:assert/strict';
import { test } from 'node:test';

import { BASE_COURSE_TYPES } from '@/db/seed-data/course-types';

import { validateBlock } from './validator';
import type { SchemaDefinition } from './types';

const quizSchema: SchemaDefinition = BASE_COURSE_TYPES.find(
  (courseType) => courseType.key === 'quiz',
)!.schemaDefinition;

test('validateBlock() lehnt grob falsch geformten Input ab (Zod-Envelope-Check)', () => {
  const result = validateBlock(
    { blockType: 'quiz-question', content: 'kein-objekt' as unknown as Record<string, unknown> },
    quizSchema,
  );
  assert.equal(result.valid, false);
  assert.ok(result.errors.length > 0);
});

test('validateBlock() lehnt unbekannten block_type ab', () => {
  const result = validateBlock({ blockType: 'not-a-real-type', content: {} }, quizSchema);
  assert.equal(result.valid, false);
  assert.equal(result.errors[0]?.field, 'blockType');
});

test('validateBlock() meldet fehlende Pflichtfelder mit Feldname', () => {
  const result = validateBlock({ blockType: 'quiz-question', content: {} }, quizSchema);
  assert.equal(result.valid, false);
  const fields = result.errors.map((error) => error.field).sort();
  assert.deepEqual(fields, ['correct_index', 'options', 'question']);
});

test('validateBlock() akzeptiert einen gültigen Quiz-Block', () => {
  const result = validateBlock(
    {
      blockType: 'quiz-question',
      content: { question: 'Was ist 1+1?', options: ['1', '2', '3'], correct_index: 1 },
    },
    quizSchema,
  );
  assert.deepEqual(result, { valid: true, errors: [] });
});

test('validateBlock() prüft array-Feld-Constraints (minItems, itemType)', () => {
  const tooFew = validateBlock(
    {
      blockType: 'quiz-question',
      content: { question: 'Q', options: ['nur eine'], correct_index: 0 },
    },
    quizSchema,
  );
  assert.equal(tooFew.valid, false);
  assert.ok(tooFew.errors.some((error) => error.field === 'options'));

  const wrongItemType = validateBlock(
    {
      blockType: 'quiz-question',
      content: { question: 'Q', options: ['a', 2], correct_index: 0 },
    },
    quizSchema,
  );
  assert.equal(wrongItemType.valid, false);
  assert.ok(wrongItemType.errors.some((error) => error.field === 'options'));
});

test('validateBlock() prüft number-Feld-Typ', () => {
  const result = validateBlock(
    {
      blockType: 'quiz-question',
      content: { question: 'Q', options: ['a', 'b'], correct_index: 'nicht-numerisch' },
    },
    quizSchema,
  );
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.field === 'correct_index'));
});

test('validateBlock() meldet einen unbekannten Feld-Typ statt eine falsch geformte Rückgabe', () => {
  const schemaWithUnknownFieldType: SchemaDefinition = {
    allowedBlockTypes: [
      {
        type: 'legacy-block',
        // Simuliert veraltete DB-Zeilen mit dem Vor-T026-Feld-Typ-Vokabular
        // ('string' statt 'text'/'markdown').
        fields: [{ name: 'content', type: 'string', required: true } as never],
      },
    ],
  };
  const result = validateBlock(
    { blockType: 'legacy-block', content: { content: 'irgendwas' } },
    schemaWithUnknownFieldType,
  );
  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0]?.field, 'content');
  assert.match(result.errors[0]?.message ?? '', /Unbekannter Feld-Typ/);
});

test('validateBlock() akzeptiert gültigen Markdown-Block', () => {
  const markdownSchema = BASE_COURSE_TYPES.find(
    (courseType) => courseType.key === 'markdown-info',
  )!.schemaDefinition;
  const result = validateBlock(
    { blockType: 'markdown', content: { content: '# Hallo' } },
    markdownSchema,
  );
  assert.deepEqual(result, { valid: true, errors: [] });
});
