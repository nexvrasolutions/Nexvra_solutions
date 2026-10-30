import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const jwtSecret = process.env.JWT_SECRET;
if (process.env.NODE_ENV === 'production' && (!jwtSecret || jwtSecret.length < 32)) {
  throw new Error('JWT_SECRET must be set to at least 32 characters in production.');
}

const secret = new TextEncoder().encode(jwtSecret || 'nexvra-development-secret-key-change-me');

export type AdminSession = {
  userId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
};

export async function createSessionToken(payload: AdminSession) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as AdminSession;
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
    redirect('/admin/login');
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
