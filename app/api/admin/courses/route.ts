import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getActiveAdminFromCookies } from '@/lib/auth';

const courseSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().default(''),
  duration: z.string().optional().default(''),
  syllabus: z.string().optional().default(''),
  technologies: z.string().optional().default(''),
  skills: z.string().optional().default(''),
  projects: z.string().optional().default(''),
  level: z.string().optional().default('Beginner'),
  image: z.string().optional().default('/images/courses/front_end.webp'),
  isActive: z.boolean().optional().default(true),
});

async function requireAdmin() {
  return getActiveAdminFromCookies();
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const payload = courseSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ message: 'Invalid course payload.' }, { status: 400 });
    }

    const values = payload.data;
    const course = await prisma.course.create({
      data: {
        code: values.code,
        slug: values.slug,
        name: values.name,
        description: values.description,
        duration: values.duration,
        syllabus: values.syllabus,
        technologies: values.technologies ? values.technologies.split(',').map((item) => item.trim()).filter(Boolean) : [],
        skills: values.skills ? values.skills.split(',').map((item) => item.trim()).filter(Boolean) : [],
        projects: values.projects ? values.projects.split(',').map((item) => item.trim()).filter(Boolean) : [],
        level: values.level,
        image: values.image,
        isActive: values.isActive,
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Create course failed:', error);
    return NextResponse.json({ message: 'Unable to create course.' }, { status: 500 });
  }
}
