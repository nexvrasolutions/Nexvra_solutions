import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getActiveAdminFromCookies } from '@/lib/auth';

const courseSchema = z.object({
  code: z.string().min(2).optional(),
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  duration: z.string().optional(),
  syllabus: z.string().optional(),
  technologies: z.string().optional(),
  skills: z.string().optional(),
  projects: z.string().optional(),
  level: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
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
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) {
    return NextResponse.json({ message: 'Course not found.' }, { status: 404 });
  }

  return NextResponse.json({ course });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const payload = courseSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ message: 'Invalid course data.' }, { status: 400 });
    }

    const data = payload.data;
    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(data.code ? { code: data.code } : {}),
        ...(data.name ? { name: data.name } : {}),
        ...(data.slug ? { slug: data.slug } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.duration !== undefined ? { duration: data.duration } : {}),
        ...(data.syllabus !== undefined ? { syllabus: data.syllabus } : {}),
        ...(data.technologies !== undefined ? { technologies: data.technologies.split(',').map((item) => item.trim()).filter(Boolean) } : {}),
        ...(data.skills !== undefined ? { skills: data.skills.split(',').map((item) => item.trim()).filter(Boolean) } : {}),
        ...(data.projects !== undefined ? { projects: data.projects.split(',').map((item) => item.trim()).filter(Boolean) } : {}),
        ...(data.level !== undefined ? { level: data.level } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
    });

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Update course failed:', error);
    return NextResponse.json({ message: 'Unable to update course.' }, { status: 500 });
  }
}
