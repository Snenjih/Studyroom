import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { ForbiddenError } from './rbac';

// Zentrale Fehlerabbildung für Route Handlers: ForbiddenError -> 403,
// Zod-Validierungsfehler -> 400 mit verständlicher Meldung, Rest -> 500.
export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof ForbiddenError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validierungsfehler', details: error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  console.error(error);
  return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
}
