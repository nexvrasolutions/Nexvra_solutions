import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { jsonError, prismaErrorResponse, readJson, requireAdmin, unauthorized, zodMessage } from '@/lib/api';
import { ENROLLMENT_STATUSES } from '@/lib/validation';

const enrollmentSchema = z.object({
  courseId: z.string().trim().min(1, 'Select a course.'),
  status: z.enum(ENROLLMENT_STATUSES, { message: 'Select a valid status.' }).optional().default('ACTIVE'),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const parsed = enrollmentSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return jsonError(zodMessage(parsed.error, 'Invalid enrollment data.'), 400);
  }

  try {
    const { id } = await params;
    const { courseId, status } = parsed.data;

    const [student, course] = await Promise.all([
      prisma.student.findUnique({ where: { id }, select: { id: true } }),
      prisma.course.findUnique({ where: { id: courseId }, select: { id: true } }),
    ]);
    if (!student) return jsonError('Student not found.', 404);
    if (!course) return jsonError('Course not found.', 404);

    const completed = status === 'COMPLETED';
    const enrollment = await prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId: id, courseId } },
      update: {
        status,
        completionDate: completed ? new Date() : null,
        approvedById: completed ? admin.id : null,
      },
      create: {
        studentId: id,
        courseId,
        status,
        completionDate: completed ? new Date() : null,
        approvedById: completed ? admin.id : null,
      },
    });

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, 'enrollment', 'Unable to save enrollment.');
  }
}
