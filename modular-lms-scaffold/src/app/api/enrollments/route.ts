import { NextResponse, type NextRequest } from 'next/server';

import { toErrorResponse } from '@/lib/api-error';
import { enrollUser } from '@/lib/db/enrollments';
import { createEnrollmentSchema } from '@/lib/schemas/enrollment';
import { requireSession } from '@/lib/session';

// Einschreiben ist Self-Service (jeder eingeloggte Nutzer schreibt sich selbst ein) —
// keine Permission nötig, nur eine gültige Session (Konzept Abschnitt 4, T021).
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const input = createEnrollmentSchema.parse(body);

    const result = await enrollUser(session.userId, input.courseId, session.orgId);
    if ('error' in result) {
      return NextResponse.json({ error: 'Kurs nicht gefunden' }, { status: 404 });
    }
    // Idempotent (T021-Abnahmekriterium): auch beim zweiten Einschreiben 200, kein 409.
    return NextResponse.json(result.enrollment, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
