import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSessionToken, setAdminSessionCookie } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid email or password format.' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const admin = await prisma.adminUser.findUnique({ where: { email } });

    if (!admin || !admin.isActive) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

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
    return NextResponse.json(
      { message: 'Unable to complete login.' },
      { status: 500 }
    );
  }
}
