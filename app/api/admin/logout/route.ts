import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  // The admin header submits a plain HTML form: send the browser back to the
  // login page instead of showing a raw JSON response.
  const wantsHtml = (request.headers.get('accept') || '').includes('text/html');
  const response = wantsHtml
    ? NextResponse.redirect(new URL('/admin/login', request.url), 303)
    : NextResponse.json({ message: 'Logged out successfully.' });
  response.cookies.set(clearAdminSessionCookie());
  return response;
}
