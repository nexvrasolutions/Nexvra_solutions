import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth';

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  await requireAdminSession();
  const params = await searchParams;
  const search = (params.search || '').trim();

  const courses = await prisma.course.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">Courses</p>
          <h1 className="mt-2 text-3xl font-bold">Course Management</h1>
        </div>

        <Link href="/admin/courses/new" className="self-start rounded-lg bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white hover:bg-black">
          + Add Course
        </Link>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <form method="GET" role="search" className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="course-search" className="sr-only">
            Search courses
          </label>
          <input
            id="course-search"
            name="search"
            defaultValue={search}
            placeholder="Search by course name or code"
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          />
          <button type="submit" className="rounded-lg border border-black/10 bg-[#0a0a0a] px-4 py-2.5 text-sm text-white">
            Search
          </button>
        </form>
      </div>

      {courses.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-black/60">
          {search ? 'No courses match your search.' : 'No courses yet. Add the first one.'}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-black/50">{course.code}</div>
            <h2 className="break-words text-xl font-semibold">{course.name}</h2>
            {course.description ? <p className="mt-2 line-clamp-3 text-sm text-black/70">{course.description}</p> : null}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>{course.duration || 'No duration set'}</span>
              <span className={course.isActive ? 'text-green-600' : 'text-red-600'}>
                {course.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mt-4">
              <Link href={`/admin/courses/${course.id}`} className="text-sm font-medium underline">
                Edit course
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
