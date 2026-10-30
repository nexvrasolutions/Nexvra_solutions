import { prisma } from '@/lib/prisma';
import { CourseForm } from '@/components/admin/course-form';
import { requireAdminSession } from '@/lib/auth';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });

  if (!course) {
    return <div className="text-red-600">Course not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-black/50">Course</p>
        <h1 className="mt-2 text-3xl font-bold">{course.name}</h1>
      </div>
      <CourseForm
        mode="edit"
        initialData={{
          id: course.id,
          code: course.code,
          name: course.name,
          slug: course.slug,
          description: course.description ?? '',
          duration: course.duration ?? '',
          syllabus: course.syllabus ?? '',
          technologies: (course.technologies || []).join(', '),
          skills: (course.skills || []).join(', '),
          projects: (course.projects || []).join(', '),
          level: course.level ?? 'Beginner',
          image: course.image ?? '/images/courses/front_end.webp',
          isActive: course.isActive,
        }}
      />
    </div>
  );
}
