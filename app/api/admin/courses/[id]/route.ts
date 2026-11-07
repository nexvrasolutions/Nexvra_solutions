import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonError, prismaErrorResponse, readJson, requireAdmin, splitList, unauthorized, zodMessage } from '@/lib/api';
import { deleteImage } from '@/lib/storage/upload';
import { courseUpdateSchema, storagePathFromUrl } from '@/lib/validation';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return jsonError('Course not found.', 404);
  return NextResponse.json({ course });
}

export async function PUT(request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const parsed = courseUpdateSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return jsonError(zodMessage(parsed.error, 'Invalid course data.'), 400);
  }
  const values = parsed.data;

  try {
    const { id } = await params;
    const existing = await prisma.course.findUnique({ where: { id }, select: { image: true } });
    if (!existing) return jsonError('Course not found.', 404);

    const updated = await prisma.course.update({
      where: { id },
      data: {
        ...(values.code !== undefined ? { code: values.code } : {}),
        ...(values.name !== undefined ? { name: values.name } : {}),
        ...(values.slug !== undefined ? { slug: values.slug } : {}),
        ...(values.description !== undefined ? { description: values.description } : {}),
        ...(values.duration !== undefined ? { duration: values.duration } : {}),
        ...(values.syllabus !== undefined ? { syllabus: values.syllabus } : {}),
        ...(values.technologies !== undefined ? { technologies: splitList(values.technologies) } : {}),
        ...(values.skills !== undefined ? { skills: splitList(values.skills) } : {}),
        ...(values.projects !== undefined ? { projects: splitList(values.projects) } : {}),
        ...(values.level !== undefined ? { level: values.level } : {}),
        ...(values.image !== undefined ? { image: values.image } : {}),
        ...(values.isActive !== undefined ? { isActive: values.isActive } : {}),
      },
    });

    // Only after the new image is saved, remove the previous uploaded file (server-derived path only).
    const oldPath = storagePathFromUrl(existing.image);
    if (oldPath && values.image !== undefined && values.image !== existing.image) {
      await deleteImage(oldPath);
    }

    return NextResponse.json({ course: updated });
  } catch (error) {
    return prismaErrorResponse(error, 'course', 'Unable to update course.');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const course = await prisma.course.delete({ where: { id } });
    const imagePath = storagePathFromUrl(course.image);
    if (imagePath) await deleteImage(imagePath);
    return NextResponse.json({ message: 'Course deleted successfully.' });
  } catch (error) {
    return prismaErrorResponse(error, 'course', 'Unable to delete course.');
  }
}
