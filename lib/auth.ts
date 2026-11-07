import { cookies } from 'next/headers';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

import {
  AdminSession,
  createSessionToken,
  verifySessionToken,
} from '@/lib/session';

export type {
  AdminSession,
};

export {
  createSessionToken,
  verifySessionToken,
};

const jwtSecret = process.env.JWT_SECRET;
if (process.env.NODE_ENV === 'production' && (!jwtSecret || jwtSecret.length < 32)) {
  throw new Error('JWT_SECRET must be set to at least 32 characters in production.');
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('nexvra_admin_session')?.value;
  if (!token) return null;

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function getActiveAdminFromCookies() {
  const session = await getSessionFromCookies();
  if (!session) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.userId },
  });

  return admin?.isActive ? admin : null;
}

export async function requireAdminSession() {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect('/admin/login');
  }


  const admin = await prisma.adminUser.findUnique({
    where: { id: session.userId },
  });

  if (!admin || !admin.isActive) {
    // Token is valid but the account was removed or deactivated: clear the session.
    redirect('/admin/login?signedout=1');
  }

  return { session, admin };
}

export async function requireSuperAdminSession() {
  const { session, admin } = await requireAdminSession();

  if (admin.role !== 'SUPER_ADMIN') {
    // Signed in but not allowed here: send them to the dashboard, not the login form.
    redirect('/admin/dashboard');
  }

  return { session, admin };
}

export function setAdminSessionCookie(token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: 'nexvra_admin_session',
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isProd,
    path: '/',
    maxAge: 60 * 60 * 8,
  };
}

export function clearAdminSessionCookie() {
  return {
    name: 'nexvra_admin_session',
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  };
}
