import { NextResponse } from 'next/server';
import { clearAdminSessionCookie, getSessionFromCookies, revokeSession } from '@/lib/auth';

export async function POST(request: Request) {
  // Revoke the session in the database first, so any copy of this cookie
  // stops working immediately (not just this browser's copy).
  let revoked = true;
  const session = await getSessionFromCookies();
  if (session) {
    try {
      await revokeSession(session.sid);
    } catch (error) {
      revoked = false;
      console.error('Admin logout: could not revoke the session:', error);
    }
  }

  // The admin header submits a plain HTML form: send the browser back to the
  // login page instead of showing a raw JSON response.
  const wantsHtml = (request.headers.get('accept') || '').includes('text/html');
  const response = wantsHtml
    ? NextResponse.redirect(new URL('/admin/login', request.url), 303)
    : revoked
      ? NextResponse.json({ message: 'Logged out successfully.' })
      : NextResponse.json({ message: 'Signed out on this device, but the session could not be revoked on the server.' }, { status: 503 });
  // Always remove the cookie from this browser, even if revocation failed.
  response.cookies.set(clearAdminSessionCookie());
  return response;
}
