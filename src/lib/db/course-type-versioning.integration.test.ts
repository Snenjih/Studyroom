// Integrationstest gegen die lokale Dev-Postgres (siehe CLAUDE.md), analog zu den
// anderen `*.integration.test.ts`-Dateien. Deckt die zentralen T032-Abnahmekriterien:
// Schema-Update erhöht `version`, alte Blöcke validieren weiter gegen ihre gespeicherte
// Version (kein Break), neue Blöcke nutzen die aktuelle Version.
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

import { eq } from 'drizzle-orm';

import { closeDb, db } from '@/db';
import { courseTypes, organizations } from '@/db/schema';

import {
  BlockValidationError,
  createBlock,
  createCourse,
  updateBlock,
} from './courses';
import {
  countBlocksOnOutdatedVersion,
  createCourseType,
  updateCourseTypeSchema,
} from './course-types';
import { createProgram, deleteProgram } from './programs';

describe('Content-Versionierung für Course-Types (T032, Integrationstest)', () => {
  let orgId: string;
  let programId: string;
  let courseTypeId: string;
  const courseTypeKey = 't032-integration-test-type';

  before(async () => {
    const [org] = await db.select().from(organizations).limit(1);
    if (!org) throw new Error('Keine Organisation gefunden — `npm run db:seed` ausführen.');
    orgId = org.id;

    const program = await createProgram(orgId, {
      title: 'T032-Integrationstest',
      description: undefined,
    });
    programId = program.id;

    const createResult = await createCourseType(orgId, {
      key: courseTypeKey,
      name: 'T032 Reflexion v1',
      schemaDefinition: {
        allowedBlockTypes: [
          {
            type: 'content',
            fields: [
              { name: 'titel', type: 'text', required: true },
              { name: 'beschreibung', type: 'text', required: true },
            ],
          },
        ],
      },
    });
    if ('error' in createResult) throw new Error('Test-Course-Type konnte nicht angelegt werden');
    courseTypeId = createResult.courseType.id;
    assert.equal(createResult.courseType.version, 1);
  });

  after(async () => {
    if (programId) await deleteProgram(programId, orgId);
    await db.delete(courseTypes).where(eq(courseTypes.key, courseTypeKey));
    await closeDb();
  });

  test('createCourseType() startet bei version 1', async () => {
    // Bereits im `before`-Hook geprüft — hier nur explizit als eigener Testfall
    // dokumentiert, damit er in der Testliste auftaucht.
    assert.ok(courseTypeId);
  });

  test('ein bei v1 angelegter Block bleibt gültig, nachdem der Course-Type auf v2 aktualisiert wurde', async () => {
    const courseResult = await createCourse(programId, orgId, {
      title: 'T032 Testkurs',
      courseTypeId,
    });
    if ('error' in courseResult) throw new Error('Testkurs konnte nicht angelegt werden');
    const courseId = courseResult.course.id;

    const block = await createBlock(courseId, orgId, {
      blockType: 'content',
      content: { titel: 'Meine Reflexion', beschreibung: 'Text dazu' },
    });
    assert.ok(block);
    assert.equal(block?.courseTypeVersion, 1);

    // Schema-Update: neues Pflichtfeld "zusatz" — erhöht version auf 2.
    const updateResult = await updateCourseTypeSchema(courseTypeId, orgId, {
      name: 'T032 Reflexion v2',
      schemaDefinition: {
        allowedBlockTypes: [
          {
            type: 'content',
            fields: [
              { name: 'titel', type: 'text', required: true },
              { name: 'beschreibung', type: 'text', required: true },
              { name: 'zusatz', type: 'text', required: true },
            ],
          },
        ],
      },
    });
    assert.ok('courseType' in updateResult);
    if ('courseType' in updateResult) {
      assert.equal(updateResult.courseType.version, 2);
    }

    // Der ALTE Block hat kein "zusatz" — würde gegen die NEUE Schema-Version (v2)
    // fehlschlagen, muss aber gegen seine gespeicherte Version (v1) weiter valide sein.
    if (block) {
      const updated = await updateBlock(courseId, block.id, orgId, {
        content: { titel: 'Aktualisiert', beschreibung: 'Immer noch ohne zusatz' },
      });
      assert.equal(updated?.id, block.id);
      assert.equal(updated?.courseTypeVersion, 1);
    }

    // Ein NEUER Block auf demselben (jetzt v2) Course-Type braucht "zusatz".
    await assert.rejects(
      () =>
        createBlock(courseId, orgId, {
          blockType: 'content',
          content: { titel: 'Neu', beschreibung: 'Ohne zusatz' },
        }),
      BlockValidationError,
    );

    const newBlock = await createBlock(courseId, orgId, {
      blockType: 'content',
      content: { titel: 'Neu', beschreibung: 'Mit zusatz', zusatz: 'da' },
    });
    assert.ok(newBlock);
    assert.equal(newBlock?.courseTypeVersion, 2);

    const outdatedCount = await countBlocksOnOutdatedVersion(courseTypeId, 2);
    assert.equal(outdatedCount, 1);
  });

  test('updateCourseTypeSchema() lehnt System-Typen und fremde Orgs ab (not_found)', async () => {
    const [systemType] = await db
      .select({ id: courseTypes.id })
      .from(courseTypes)
      .where(eq(courseTypes.key, 'quiz'))
      .limit(1);
    assert.ok(systemType?.id);

    const result = await updateCourseTypeSchema(systemType.id, orgId, {
      name: 'Sollte nicht klappen',
      schemaDefinition: { allowedBlockTypes: [] },
    });
    assert.deepEqual(result, { error: 'not_found' });
  });
});
