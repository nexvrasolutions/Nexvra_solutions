import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSessionToken, setAdminSessionCookie } from '@/lib/auth';
import { jsonError, readJson } from '@/lib/api';
import { clearFailures, loginKey, recordFailure, retryAfterSeconds } from '@/lib/rate-limit';

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
  const key = loginKey(request, email);
  const retryAfter = retryAfterSeconds(key);
  if (retryAfter > 0) {
    return NextResponse.json(
      { message: `Too many failed attempts. Try again in ${Math.ceil(retryAfter / 60)} minute(s).` },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const admin = await prisma.adminUser.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    // Always run bcrypt so a missing account answers as slowly as a wrong password
    // (otherwise response timing reveals which emails are admins).
    const passwordMatches = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
    if (!admin || !admin.isActive || !passwordMatches) {
      recordFailure(key);
      return jsonError('Invalid credentials.', 401);
    }

    clearFailures(key);
    const token = await createSessionToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

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
