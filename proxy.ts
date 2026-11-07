import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/session';

const SESSION_COOKIE = 'nexvra_admin_session';

const clearedCookie = {
  name: SESSION_COOKIE,
  value: '',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 0,
};

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await verifySessionToken(token);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signedIn = await hasValidSession(request);

  if (pathname === '/admin/login') {
    if (request.nextUrl.searchParams.has('signedout')) {
      // Sent here because the account is no longer active: drop the cookie and show the form.
      const response = NextResponse.next();
      response.cookies.set({ ...clearedCookie });
      return response;
    }
    // Already signed in: skip the login form.
    return signedIn ? NextResponse.redirect(new URL('/admin/dashboard', request.url)) : NextResponse.next();
  }

  if (signedIn) {
    return NextResponse.next();
  }

  const response = NextResponse.redirect(new URL('/admin/login', request.url));
  if (request.cookies.has(SESSION_COOKIE)) {
    // Expired or forged token: clear it.
    response.cookies.set({ ...clearedCookie });
  }
  return response;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
