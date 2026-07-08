import assert from 'node:assert/strict';
import { test } from 'node:test';

import { validateBlock } from '@/lib/schema-definition/validator';

import { defaultBlockContent } from './block-defaults';

test('defaultBlockContent() für die drei hartcodierten Block-Typen bleibt unverändert', () => {
  assert.deepEqual(defaultBlockContent('markdown'), { content: '' });
  assert.deepEqual(defaultBlockContent('flashcard'), { front: '', back: '' });
  assert.deepEqual(defaultBlockContent('quiz-question'), {
    question: '',
    options: ['', ''],
    correct_index: 0,
  });
});

test('defaultBlockContent() für Custom-Block-Typen enthält alle Pflichtfeld-Keys (Regressionstest)', () => {
  const fields = [
    { name: 'titel', type: 'text' as const, required: true },
    { name: 'anzahl', type: 'number' as const, required: true },
    { name: 'aktiv', type: 'boolean' as const, required: true },
    { name: 'auswahl', type: 'select' as const, required: true, options: ['a', 'b'] },
    { name: 'tags', type: 'array' as const, required: false, itemType: 'text' as const },
  ];

  const content = defaultBlockContent('content', fields);

  assert.deepEqual(content, {
    titel: '',
    anzahl: 0,
    aktiv: false,
    auswahl: 'a',
    tags: [],
  });

  // Der Kern des Bugs: ein frisch angelegter Block muss die Validierung bestehen,
  // sonst crasht addBlockAction() beim ersten Klick auf "+ Hinzufügen" (T029-Fund).
  const validation = validateBlock(
    { blockType: 'content', content },
    { allowedBlockTypes: [{ type: 'content', fields }] },
  );
  assert.deepEqual(validation, { valid: true, errors: [] });
});

test('defaultBlockContent() ohne fields (unbekannter Typ) gibt leeres Objekt zurück', () => {
  assert.deepEqual(defaultBlockContent('completely-unknown'), {});
});
