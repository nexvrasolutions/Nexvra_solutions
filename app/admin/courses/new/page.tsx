import { CourseForm } from '@/components/admin/course-form';
import { requireAdminSession } from '@/lib/auth';

export default async function NewCoursePage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-black/50">Courses</p>
        <h1 className="mt-2 text-3xl font-bold">Add New Course</h1>
      </div>
      <CourseForm />
    </div>
  );
}
