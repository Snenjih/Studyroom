// Echter Integrationstest gegen die lokale Dev-Postgres (siehe CLAUDE.md: 127.0.0.1:5432,
// bereits migriert + geseedet). Legt ein eigenes, temporäres Program/Course an und räumt
// am Ende wieder auf (Cascade-Delete über `programs` -> `courses` -> `content_blocks`) —
// rührt keine der geseedeten Basisdaten an.
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

import { eq } from 'drizzle-orm';

import { closeDb, db } from '@/db';
import { courseTypes, organizations } from '@/db/schema';

import { createProgram, deleteProgram } from './programs';
import { BlockValidationError, createBlock, createCourse, updateBlock } from './courses';

describe('Content-Block-Validierung (T027, Integrationstest)', () => {
  let orgId: string;
  let programId: string;
  let quizCourseId: string;

  before(async () => {
    const [org] = await db.select().from(organizations).limit(1);
    if (!org) throw new Error('Keine Organisation gefunden — `npm run db:seed` ausführen.');
    orgId = org.id;

    const [quizType] = await db
      .select()
      .from(courseTypes)
      .where(eq(courseTypes.key, 'quiz'))
      .limit(1);
    if (!quizType) throw new Error('Course-Type "quiz" fehlt — `npm run db:seed` ausführen.');

    const program = await createProgram(orgId, {
      title: 'T027-Integrationstest',
      description: undefined,
    });
    programId = program.id;

    const result = await createCourse(programId, orgId, {
      title: 'T027 Quiz-Kurs',
      courseTypeId: quizType.id,
    });
    if ('error' in result) throw new Error(`Test-Kurs konnte nicht angelegt werden: ${result.error}`);
    quizCourseId = result.course.id;
  });

  after(async () => {
    if (programId) await deleteProgram(programId, orgId);
    await closeDb();
  });

  test('createBlock() wirft BlockValidationError bei unbekanntem block_type', async () => {
    await assert.rejects(
      () => createBlock(quizCourseId, orgId, { blockType: 'does-not-exist', content: {} }),
      BlockValidationError,
    );
  });

  test('createBlock() wirft BlockValidationError bei fehlendem Pflichtfeld', async () => {
    await assert.rejects(async () => {
      try {
        await createBlock(quizCourseId, orgId, { blockType: 'quiz-question', content: {} });
      } catch (error) {
        assert.ok(error instanceof BlockValidationError);
        const fields = error.errors.map((entry) => entry.field).sort();
        assert.deepEqual(fields, ['correct_index', 'options', 'question']);
        throw error;
      }
    }, BlockValidationError);
  });

  test('createBlock() speichert einen gültigen Block', async () => {
    const block = await createBlock(quizCourseId, orgId, {
      blockType: 'quiz-question',
      content: { question: 'Was ist 1+1?', options: ['1', '2'], correct_index: 1 },
    });
    assert.ok(block);
    assert.equal(block?.blockType, 'quiz-question');

    if (block) {
      await assert.rejects(
        () => updateBlock(quizCourseId, block.id, orgId, { content: {} }),
        BlockValidationError,
      );

      const updated = await updateBlock(quizCourseId, block.id, orgId, {
        content: { question: 'Neue Frage', options: ['a', 'b'], correct_index: 0 },
      });
      assert.equal(updated?.id, block.id);
    }
  });
});
