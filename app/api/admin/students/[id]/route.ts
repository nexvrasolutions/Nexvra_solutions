import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getActiveAdminFromCookies } from '@/lib/auth';

const studentSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(8).optional(),
  institution: z.string().optional(),
  department: z.string().optional(),
  batch: z.string().optional(),
  publicProfileEnabled: z.boolean().optional(),
});

async function requireAdmin() {
  return getActiveAdminFromCookies();
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: { course: true },
      },
    },
  });

  if (!student) {
    return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
  }

  return NextResponse.json({ student });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const payload = studentSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ message: 'Invalid update data.' }, { status: 400 });
    }

    if (payload.data.email) {
      const existing = await prisma.student.findFirst({
        where: {
          email: payload.data.email,
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json({ message: 'A student with this email already exists.' }, { status: 409 });
      }
    }

    const student = await prisma.student.update({
      where: { id },
      data: payload.data,
    });

    return NextResponse.json({ student });
  } catch (error) {
    console.error('Update student failed:', error);
    return NextResponse.json({ message: 'Unable to update student.' }, { status: 500 });
  }
}
