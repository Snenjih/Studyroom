// Integrationstest gegen die lokale Dev-Postgres (siehe CLAUDE.md), analog zu
// `courses.integration.test.ts` (T027). Legt einen temporären Custom-Course-Type an
// und löscht ihn danach wieder — rührt die geseedeten System-Typen nicht an.
import assert from 'node:assert/strict';
import { after, test } from 'node:test';

import { eq } from 'drizzle-orm';

import { closeDb, db } from '@/db';
import { courseTypes, organizations } from '@/db/schema';
import { validateBlock } from '@/lib/schema-definition/validator';

import {
  courseTypeKeyExists,
  createCourseType,
  isSystemCourseType,
  listCourseTypesForOrg,
} from './course-types';

const TEST_KEY = 't028-integration-test-type';

after(async () => {
  await db.delete(courseTypes).where(eq(courseTypes.key, TEST_KEY));
  await closeDb();
});

test('createCourseType() legt einen Custom-Typ mit org_id an', async () => {
  const [org] = await db.select().from(organizations).limit(1);
  assert.ok(org, 'Seed-Organisation muss existieren (npm run db:seed)');

  const result = await createCourseType(org.id, {
    key: TEST_KEY,
    name: 'T028 Integrationstest-Typ',
    schemaDefinition: {
      allowedBlockTypes: [
        {
          type: 'content',
          fields: [
            { name: 'titel', type: 'text', required: true },
            { name: 'bewertung', type: 'select', required: true, options: ['gut', 'schlecht'] },
          ],
        },
      ],
    },
  });

  assert.ok('courseType' in result);
  if ('courseType' in result) {
    assert.equal(result.courseType.orgId, org.id);
    assert.equal(isSystemCourseType(result.courseType), false);

    const validation = validateBlock(
      { blockType: 'content', content: { titel: 'Hallo', bewertung: 'gut' } },
      result.courseType.schemaDefinition,
    );
    assert.deepEqual(validation, { valid: true, errors: [] });
  }
});

test('createCourseType() lehnt bereits verwendeten Key ab', async () => {
  const [org] = await db.select().from(organizations).limit(1);
  assert.ok(org);

  const result = await createCourseType(org.id, {
    key: 'quiz',
    name: 'Duplikat',
    schemaDefinition: { allowedBlockTypes: [] },
  });
  assert.deepEqual(result, { error: 'key_exists' });
});

test('courseTypeKeyExists() erkennt System-Type-Keys', async () => {
  assert.equal(await courseTypeKeyExists('quiz'), true);
  assert.equal(await courseTypeKeyExists('definitiv-kein-echter-key'), false);
});

test('listCourseTypesForOrg() enthält System-Typen und eigene Custom-Typen', async () => {
  const [org] = await db.select().from(organizations).limit(1);
  assert.ok(org);

  const list = await listCourseTypesForOrg(org.id);
  const keys = list.map((courseType) => courseType.key);
  assert.ok(keys.includes('quiz'));
  assert.ok(keys.includes(TEST_KEY));
});
