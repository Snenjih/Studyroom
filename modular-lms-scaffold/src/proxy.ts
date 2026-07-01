import { NextResponse, type NextRequest } from 'next/server';

import { getSession } from '@/lib/session';

// Next.js 16 hat `middleware.ts` in `proxy.ts` umbenannt (siehe AGENTS.md /
// node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md).
const PUBLIC_ROUTES = ['/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const session = await getSession();

  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
