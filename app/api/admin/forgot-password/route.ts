import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { jsonError, readJson } from '@/lib/api';
import { isEmailConfigured, sendPasswordResetOtp } from '@/lib/email';
import {
  GENERIC_REQUEST_MESSAGE,
  OTP_MAX_REQUESTS_PER_WINDOW,
  OTP_REQUEST_WINDOW_MINUTES,
  OTP_TTL_MINUTES,
  generateOtp,
} from '@/lib/password-reset';

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return jsonError('Enter a valid email address.', 400);
  }
  // If email sending isn't set up on the server, say so plainly (reveals nothing
  // about any account).
  if (!isEmailConfigured()) {
    return jsonError('Password reset by email is not available yet. Please contact your administrator.', 503);
  }

  const { email } = parsed.data;
  try {
    const admin = await prisma.adminUser.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    // Only do real work for an active account, but always answer the same way.
    if (admin && admin.isActive) {
      const windowStart = new Date(Date.now() - OTP_REQUEST_WINDOW_MINUTES * 60_000);
      const recent = await prisma.passwordResetOtp.count({
        where: { adminUserId: admin.id, createdAt: { gte: windowStart } },
      });
      if (recent < OTP_MAX_REQUESTS_PER_WINDOW) {
        const code = generateOtp();
        const otpHash = await bcrypt.hash(code, 10);
        // Invalidate any earlier unused codes, then store the new one.
        await prisma.passwordResetOtp.updateMany({
          where: { adminUserId: admin.id, consumedAt: null },
          data: { consumedAt: new Date() },
        });
        await prisma.passwordResetOtp.create({
          data: { adminUserId: admin.id, otpHash, expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60_000) },
        });
        try {
          await sendPasswordResetOtp(admin.email, code, OTP_TTL_MINUTES);
        } catch (error) {
          // Don't leak whether sending worked; log for the operator.
          console.error('Password reset email failed to send:', error);
        }
      }
    }

    // Occasional cleanup of old codes.
    if (Math.random() < 0.1) {
      await prisma.passwordResetOtp
        .deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 24 * 60 * 60_000) } } })
        .catch(() => {});
    }

    return NextResponse.json({ message: GENERIC_REQUEST_MESSAGE });
  } catch (error) {
    console.error('Forgot-password request failed:', error);
    return jsonError('Unable to process the request. Please try again.', 500);
  }
}
