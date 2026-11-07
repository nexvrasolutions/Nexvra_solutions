import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CourseForm } from '@/components/admin/course-form';
import { DeleteButton } from '@/components/admin/delete-button';
import { requireAdminSession } from '@/lib/auth';

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { _count: { select: { enrollments: true } } },
  });

  if (!course) notFound();

  const enrolled = course._count.enrollments;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">Course · {course.code}</p>
          <h1 className="mt-2 break-words text-3xl font-bold">{course.name}</h1>
        </div>
        <Link href="/admin/courses" className="self-start rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium sm:self-auto">
          Back to list
        </Link>
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

      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-red-700">Danger zone</h2>
        <p className="mt-2 text-sm text-black/60">
          {enrolled > 0
            ? `${enrolled} student enrollment(s) use this course and will be removed from their verification pages. To keep history, untick “Course is active” instead.`
            : 'No students are enrolled in this course.'}
        </p>
        <div className="mt-4">
          <DeleteButton
            endpoint={`/api/admin/courses/${course.id}`}
            label="Delete Course"
            confirmText={
              enrolled > 0
                ? `Delete "${course.name}"? ${enrolled} enrollment(s) will also be removed. This cannot be undone.`
                : `Delete "${course.name}"? This cannot be undone.`
            }
            redirectTo="/admin/courses"
          />
        </div>
      </section>
    </div>
  );
}
