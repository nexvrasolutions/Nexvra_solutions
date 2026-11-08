import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { jsonError, readJson } from '@/lib/api';
import { GENERIC_INVALID_CODE_MESSAGE, OTP_MAX_ATTEMPTS, RESET_PASSWORD_MIN } from '@/lib/password-reset';

/** bcrypt hash of a throwaway string, used to keep timing uniform when no code exists. */
const DUMMY_HASH = '$2b$10$C6UzMDM.H6dfI/f/IKxGhuK1Q0d5Q6pN5V7wJ3hK9qFZ1yQ8Qz2Ve';

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  code: z.string().trim().regex(/^\d{6}$/, 'Enter the 6-digit code.'),
  password: z
    .string()
    .min(RESET_PASSWORD_MIN, `Password must be at least ${RESET_PASSWORD_MIN} characters.`)
    .max(200, 'Password is too long.'),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || 'Invalid request.', 400);
  }
  const { email, code, password } = parsed.data;

  try {
    const admin = await prisma.adminUser.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });
    const otp = admin
      ? await prisma.passwordResetOtp.findFirst({
          where: { adminUserId: admin.id, consumedAt: null, expiresAt: { gt: new Date() } },
          orderBy: { createdAt: 'desc' },
        })
      : null;

    // Always run a bcrypt compare so a missing account/code answers as slowly as a wrong code.
    if (!admin || !admin.isActive || !otp) {
      await bcrypt.compare(code, DUMMY_HASH);
      return jsonError(GENERIC_INVALID_CODE_MESSAGE, 400);
    }

    // Too many wrong guesses: burn this code.
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      await prisma.passwordResetOtp.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
      return jsonError('Too many incorrect attempts. Please request a new code.', 429);
    }

    const matches = await bcrypt.compare(code, otp.otpHash);
    if (!matches) {
      await prisma.passwordResetOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      return jsonError(GENERIC_INVALID_CODE_MESSAGE, 400);
    }

    // Correct code: set the new password, consume the code, and revoke every session.
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.$transaction([
      prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash } }),
      prisma.passwordResetOtp.update({ where: { id: otp.id }, data: { consumedAt: new Date() } }),
      prisma.adminSession.updateMany({ where: { adminUserId: admin.id, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);

    return NextResponse.json({ message: 'Your password has been reset. You can now sign in with your new password.' });
  } catch (error) {
    console.error('Password reset failed:', error);
    return jsonError('Unable to reset the password. Please try again.', 500);
  }
}
