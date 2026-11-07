import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonError, prismaErrorResponse, readJson, requireAdmin, splitList, unauthorized, zodMessage } from '@/lib/api';
import { courseCreateSchema } from '@/lib/validation';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  // Images are uploaded first through /api/admin/upload; this endpoint takes JSON only.
  const parsed = courseCreateSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return jsonError(zodMessage(parsed.error, 'Invalid course data.'), 400);
  }
  const values = parsed.data;

  try {
    const course = await prisma.course.create({
      data: {
        code: values.code,
        slug: values.slug,
        name: values.name,
        description: values.description,
        duration: values.duration,
        syllabus: values.syllabus,
        technologies: splitList(values.technologies),
        skills: splitList(values.skills),
        projects: splitList(values.projects),
        level: values.level,
        image: values.image,
        isActive: values.isActive,
      },
    });
    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, 'course', 'Unable to create course.');
  }
}
