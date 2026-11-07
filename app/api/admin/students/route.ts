import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { jsonError, prismaErrorResponse, readJson, requireAdmin, unauthorized, zodMessage } from '@/lib/api';
import { parseDateOnly } from '@/lib/dates';
import { NEXVRA_PROVIDER, studentCreateSchema } from '@/lib/validation';

function newStudentCode() {
  return `NEX-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const [students, departments, institutions, programTypes] = await Promise.all([
    prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        enrollments: { include: { course: true } },
        departmentOption: true,
        institutionOption: true,
        programTypeOption: true,
      },
    }),
    prisma.department.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    prisma.institution.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    prisma.programTypeOption.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ]);

  return NextResponse.json({ students, departments, institutions, programTypes });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const parsed = studentCreateSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return jsonError(zodMessage(parsed.error, 'Invalid student data.'), 400);
  }
  const values = parsed.data;

  try {
    if (values.email) {
      const existing = await prisma.student.findFirst({
        where: { email: { equals: values.email, mode: 'insensitive' } },
      });
      if (existing) {
        return jsonError('A student with this email already exists.', 409);
      }
    }

    const profileToken = crypto.randomBytes(24).toString('hex');
    const data = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      studentPhoto: values.studentPhoto,
      courseName: values.courseName,
      department: values.department || null,
      departmentId: values.departmentId || null,
      // Fixed for every certificate; never read from the request.
      instituteName: NEXVRA_PROVIDER,
      learnedFrom: NEXVRA_PROVIDER,
      batchStartDate: parseDateOnly(values.batchStartDate),
      batchEndDate: parseDateOnly(values.batchEndDate),
      batch: values.batch || null,
      programType: values.programType,
      programTypeOptionId: values.programTypeOptionId || null,
      publicProfileEnabled: values.publicProfileEnabled,
      profileToken,
      // QR images are generated on demand; this records where admins can fetch it.
      profileQrPath: null,
    };

    // Student codes are random; retry in the unlikely event of a collision.
    for (let attempt = 0; ; attempt++) {
      try {
        const student = await prisma.student.create({
          data: { ...data, studentCode: newStudentCode() },
          include: { departmentOption: true, institutionOption: true, programTypeOption: true },
        });
        return NextResponse.json({ student }, { status: 201 });
      } catch (error) {
        const codeClash =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002' &&
          JSON.stringify(error.meta?.target ?? '').includes('studentCode');
        if (!codeClash || attempt >= 3) throw error;
      }
    }
  } catch (error) {
    return prismaErrorResponse(error, 'student', 'Unable to create student.');
  }
}
