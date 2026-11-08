import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { AdminUser } from '@prisma/client';
import { prisma } from '@/lib/prisma';

import {
  AdminSession,
  SESSION_TTL_SECONDS,
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

export const SESSION_COOKIE = 'nexvra_admin_session';

/** Revoked and expired session rows are kept this long (for troubleshooting), then removed. */
const KEEP_OLD_SESSIONS_MS = 7 * 24 * 60 * 60 * 1000;

const jwtSecret = process.env.JWT_SECRET;
if (process.env.NODE_ENV === 'production' && (!jwtSecret || jwtSecret.length < 32)) {
  throw new Error('JWT_SECRET must be set to at least 32 characters in production.');
}

/** The signed session from the cookie (signature and expiry checked), or null. */
export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * The admin for a signed session, but only while its database row exists, is
 * not revoked, has not expired and belongs to an active account. This is what
 * makes logout (and copied cookies) take effect immediately.
 */
async function adminForSession(session: AdminSession): Promise<AdminUser | null> {
  const row = await prisma.adminSession.findUnique({
    where: { id: session.sid },
    include: { adminUser: true },
  });
  if (!row || row.revokedAt || row.expiresAt <= new Date()) return null;
  if (row.adminUserId !== session.userId || !row.adminUser.isActive) return null;
  return row.adminUser;
}

export async function getActiveAdminFromCookies() {
  const session = await getSessionFromCookies();
  if (!session) return null;
  return adminForSession(session);
}

export async function requireAdminSession() {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect('/admin/login');
  }

  const admin = await adminForSession(session);
  if (!admin) {
    // Signed token, but the session was revoked/expired or the account was
    // deactivated: clear the cookie and show the login form.
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

/** Records a new session for the admin and returns the signed token for the cookie. */
export async function startAdminSession(admin: Pick<AdminUser, 'id' | 'email' | 'role'>) {
  const now = Date.now();
  const sid = crypto.randomBytes(32).toString('base64url');
  await prisma.adminSession.create({
    data: { id: sid, adminUserId: admin.id, expiresAt: new Date(now + SESSION_TTL_SECONDS * 1000) },
  });

  // Housekeeping: drop rows that stopped being usable more than a week ago.
  const cutoff = new Date(now - KEEP_OLD_SESSIONS_MS);
  await prisma.adminSession
    .deleteMany({ where: { OR: [{ expiresAt: { lt: cutoff } }, { revokedAt: { lt: cutoff } }] } })
    .catch((error) => console.warn('Could not remove old admin sessions:', error));

  return createSessionToken({ sid, userId: admin.id, email: admin.email, role: admin.role });
}

/** Revokes one session; every copy of its cookie stops working at once. */
export async function revokeSession(sid: string) {
  await prisma.adminSession.updateMany({
    where: { id: sid, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/** Signs an admin out everywhere (e.g. after a password reset). */
export async function revokeAllSessions(adminUserId: string) {
  const { count } = await prisma.adminSession.updateMany({
    where: { adminUserId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return count;
}

export function setAdminSessionCookie(token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isProd,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function clearAdminSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  };
}
