import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { setAdminSessionCookie, startAdminSession } from '@/lib/auth';
import { jsonError, readJson } from '@/lib/api';
import {
  TOO_MANY_ATTEMPTS_MESSAGE,
  loginThrottleKeys,
  registerLoginAttempt,
  registerLoginSuccess,
} from '@/lib/rate-limit';

/** bcrypt hash (cost 12) of a random throwaway string; never matches a real password. */
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKxGhuK1Q0d5Q6pN5V7wJ3hK9qFZ1yQ8Qz2Ve';

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6).max(200),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return jsonError('Invalid email or password format.', 400);
  }

  const { email, password } = parsed.data;

  try {
    // Shared across all server instances; counted before the password is checked.
    const keys = loginThrottleKeys(request, email);
    const retryAfter = await registerLoginAttempt(keys);
    if (retryAfter > 0) {
      return NextResponse.json(
        { message: TOO_MANY_ATTEMPTS_MESSAGE },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const admin = await prisma.adminUser.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    // Always run bcrypt so a missing account answers as slowly as a wrong password
    // (otherwise response timing reveals which emails are admins).
    const passwordMatches = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
    // One message for unknown email, wrong password and deactivated account.
    if (!admin || !admin.isActive || !passwordMatches) {
      return jsonError('Invalid credentials.', 401);
    }

    await registerLoginSuccess(keys);
    // Stored server-side so logout can revoke it (see lib/auth.ts).
    const token = await startAdminSession(admin);

    const response = NextResponse.json({
      message: 'Login successful.',
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    });
    response.cookies.set(setAdminSessionCookie(token));
    return response;
  } catch (error) {
    console.error('Admin login failed:', error);
    return jsonError('Unable to complete login.', 500);
  }
}
