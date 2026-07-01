import 'server-only';

import { and, count, eq, inArray } from 'drizzle-orm';

import { db } from '@/db';
import { blockProgress, contentBlocks, courses, enrollments, programs } from '@/db/schema';

export interface EnrolledCourseSummary {
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  programTitle: string;
  progressPercent: number;
}

// Zwei aggregierte Queries statt einer Query pro Enrollment (kein N+1, analog zum
// JOIN-Pattern in src/lib/rbac.ts).
export async function getEnrolledCourses(userId: string): Promise<EnrolledCourseSummary[]> {
  const enrollmentRows = await db
    .select({
      enrollmentId: enrollments.id,
      courseId: courses.id,
      courseTitle: courses.title,
      programTitle: programs.title,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .innerJoin(programs, eq(courses.programId, programs.id))
    .where(eq(enrollments.userId, userId));

  if (enrollmentRows.length === 0) return [];

  const courseIds = [...new Set(enrollmentRows.map((row) => row.courseId))];
  const enrollmentIds = enrollmentRows.map((row) => row.enrollmentId);

  const totalBlockRows = await db
    .select({ courseId: contentBlocks.courseId, total: count() })
    .from(contentBlocks)
    .where(inArray(contentBlocks.courseId, courseIds))
    .groupBy(contentBlocks.courseId);
  const totalBlocksByCourse = new Map(totalBlockRows.map((row) => [row.courseId, row.total]));

  const doneBlockRows = await db
    .select({ enrollmentId: blockProgress.enrollmentId, done: count() })
    .from(blockProgress)
    .where(and(inArray(blockProgress.enrollmentId, enrollmentIds), eq(blockProgress.status, 'done')))
    .groupBy(blockProgress.enrollmentId);
  const doneBlocksByEnrollment = new Map(doneBlockRows.map((row) => [row.enrollmentId, row.done]));

  return enrollmentRows.map((row) => {
    const total = totalBlocksByCourse.get(row.courseId) ?? 0;
    const done = doneBlocksByEnrollment.get(row.enrollmentId) ?? 0;
    const progressPercent = total === 0 ? 0 : Math.round((done / total) * 100);
    return {
      enrollmentId: row.enrollmentId,
      courseId: row.courseId,
      courseTitle: row.courseTitle,
      programTitle: row.programTitle,
      progressPercent,
    };
  });
}

export async function getManagedPrograms(orgId: string) {
  return db.select().from(programs).where(eq(programs.orgId, orgId)).orderBy(programs.title);
}
