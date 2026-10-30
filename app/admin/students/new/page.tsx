import { StudentForm } from '@/components/admin/student-form';
import { requireAdminSession } from '@/lib/auth';

export default async function NewStudentPage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-black/50">Students</p>
        <h1 className="mt-2 text-3xl font-bold">Add New Student</h1>
      </div>
      <StudentForm />
    </div>
  );
}
