import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getActiveAdminFromCookies } from '@/lib/auth';

const enrollmentSchema = z.object({
  courseId: z.string().min(1),
  status: z.enum(['ACTIVE','COMPLETED','REJECTED']).optional(),
});

async function requireAdmin() {
  return getActiveAdminFromCookies();
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const payload = enrollmentSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ message: 'Invalid enrollment payload.' }, { status: 400 });
    }

    const { courseId, status } = payload.data;
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ message: 'Course not found.' }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        studentId_courseId: {
          studentId: id,
          courseId,
        },
      },
      update: {
        status: status || 'ACTIVE',
        completionDate: status === 'COMPLETED' ? new Date() : null,
      },
      create: {
        studentId: id,
        courseId,
        status: status || 'ACTIVE',
        completionDate: status === 'COMPLETED' ? new Date() : null,
      },
    });

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    console.error('Create enrollment failed:', error);
    return NextResponse.json({ message: 'Unable to create enrollment.' }, { status: 500 });
  }
}
