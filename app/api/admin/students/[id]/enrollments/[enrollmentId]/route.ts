import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonError, prismaErrorResponse, requireAdmin, unauthorized } from '@/lib/api';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; enrollmentId: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { id, enrollmentId } = await params;
    const result = await prisma.enrollment.deleteMany({ where: { id: enrollmentId, studentId: id } });
    if (result.count === 0) return jsonError('Enrollment not found.', 404);
    return NextResponse.json({ message: 'Enrollment removed.' });
  } catch (error) {
    return prismaErrorResponse(error, 'enrollment', 'Unable to remove enrollment.');
  }
}
