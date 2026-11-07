import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonError, prismaErrorResponse, readJson, requireAdmin, unauthorized, zodMessage } from '@/lib/api';
import { deleteImage } from '@/lib/storage/upload';
import { parseDateOnly } from '@/lib/dates';
import { batchOrderMessage, storagePathFromUrl, studentUpdateSchema } from '@/lib/validation';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      enrollments: { include: { course: true } },
      departmentOption: true,
      institutionOption: true,
      programTypeOption: true,
    },
  });

  if (!student) return jsonError('Student not found.', 404);
  return NextResponse.json({ student });
}

export async function PUT(request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const parsed = studentUpdateSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return jsonError(zodMessage(parsed.error, 'Invalid student data.'), 400);
  }
  const values = parsed.data;

  try {
    const { id } = await params;
    const current = await prisma.student.findUnique({
      where: { id },
      select: { studentPhoto: true, batchStartDate: true, batchEndDate: true },
    });
    if (!current) return jsonError('Student not found.', 404);

    if (values.email) {
      const existing = await prisma.student.findFirst({
        where: { email: { equals: values.email, mode: 'insensitive' }, NOT: { id } },
      });
      if (existing) {
        return jsonError('A student with this email already exists.', 409);
      }
    }

    // When only one batch date changes, check it against the stored other one.
    const start = values.batchStartDate ? parseDateOnly(values.batchStartDate) : current.batchStartDate;
    const end = values.batchEndDate ? parseDateOnly(values.batchEndDate) : current.batchEndDate;
    if (start && end && end < start) {
      return jsonError(batchOrderMessage, 400);
    }

    const has = (key: keyof typeof values) => values[key] !== undefined;

    const student = await prisma.student.update({
      where: { id },
      data: {
        ...(has('fullName') ? { fullName: values.fullName } : {}),
        ...(has('email') ? { email: values.email } : {}),
        ...(has('phone') ? { phone: values.phone } : {}),
        ...(has('address') ? { address: values.address } : {}),
        ...(has('studentPhoto') ? { studentPhoto: values.studentPhoto } : {}),
        ...(has('courseName') ? { courseName: values.courseName } : {}),
        ...(has('department') ? { department: values.department || null } : {}),
        ...(has('departmentId') ? { departmentId: values.departmentId } : {}),
        ...(values.batchStartDate ? { batchStartDate: parseDateOnly(values.batchStartDate) } : {}),
        ...(values.batchEndDate ? { batchEndDate: parseDateOnly(values.batchEndDate) } : {}),
        ...(has('batch') ? { batch: values.batch || null } : {}),
        ...(has('programType') ? { programType: values.programType } : {}),
        ...(has('programTypeOptionId') ? { programTypeOptionId: values.programTypeOptionId } : {}),
        ...(has('publicProfileEnabled') ? { publicProfileEnabled: values.publicProfileEnabled } : {}),
        // instituteName / learnedFrom are fixed to Nexvra Solutions and never editable.
      },
      include: { departmentOption: true, institutionOption: true, programTypeOption: true },
    });

    // The photo was replaced or removed: delete the old file from storage.
    if (values.studentPhoto !== undefined && current.studentPhoto && current.studentPhoto !== student.studentPhoto) {
      const oldPath = storagePathFromUrl(current.studentPhoto);
      if (oldPath) await deleteImage(oldPath);
    }

    return NextResponse.json({ student });
  } catch (error) {
    return prismaErrorResponse(error, 'student', 'Unable to update student.');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const removed = await prisma.student.delete({ where: { id }, select: { studentPhoto: true } });
    const photoPath = storagePathFromUrl(removed.studentPhoto);
    if (photoPath) await deleteImage(photoPath);
    return NextResponse.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    return prismaErrorResponse(error, 'student', 'Unable to delete student.');
  }
}
