import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getActiveAdminFromCookies } from '@/lib/auth';
import { generateStudentQrPng } from '@/lib/qr';

const studentSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  institution: z.string().optional().default(''),
  department: z.string().optional().default(''),
  batch: z.string().optional().default(''),
  publicProfileEnabled: z.boolean().optional().default(true),
});

async function requireAdmin() {
  return getActiveAdminFromCookies();
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      enrollments: {
        include: { course: true },
      },
    },
  });

  return NextResponse.json({ students });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const parsed = studentSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid student payload.' }, { status: 400 });
    }

    const values = parsed.data;
    const existing = await prisma.student.findUnique({ where: { email: values.email } });
    if (existing) {
      return NextResponse.json({ message: 'A student with this email already exists.' }, { status: 409 });
    }

    const token = crypto.randomBytes(24).toString('hex');
    const studentCode = `NEX-${Date.now().toString().slice(-8)}`;
    const qrPath = await generateStudentQrPng(token);

    const student = await prisma.student.create({
      data: {
        studentCode,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        institution: values.institution,
        department: values.department,
        batch: values.batch,
        publicProfileEnabled: values.publicProfileEnabled,
        profileToken: token,
        profileQrPath: qrPath,
      },
    });

    return NextResponse.json({ student }, { status: 201 });
  } catch (error) {
    console.error('Create student failed:', error);
    return NextResponse.json({ message: 'Unable to create student.' }, { status: 500 });
  }
}
