import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { StudentForm } from '@/components/admin/student-form';
import { EnrollmentForm } from '@/components/admin/enrollment-form';
import { requireAdminSession } from '@/lib/auth';

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;

  const [student, courses] = await Promise.all([
    prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { course: true },
        },
      },
    }),
    prisma.course.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!student) {
    return <div className="text-red-600">Student not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">Student</p>
          <h1 className="mt-2 text-3xl font-bold">{student.fullName}</h1>
        </div>
        <Link href="/admin/students" className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium">
          Back to list
        </Link>
      </div>

      <StudentForm
        mode="edit"
        initialData={{
          id: student.id,
          fullName: student.fullName,
          email: student.email,
          phone: student.phone,
          institution: student.institution ?? '',
          department: student.department ?? '',
          batch: student.batch ?? '',
          publicProfileEnabled: student.publicProfileEnabled,
        }}
      />

      <EnrollmentForm studentId={student.id} courses={courses} />

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Student QR</h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="overflow-hidden rounded-xl border border-black/10 bg-[#f8f8f8] p-4">
            <img src={`/api/admin/students/${student.id}/qr`} alt={`${student.fullName} QR code`} className="h-40 w-40 object-contain" />
          </div>
          <div>
            <a href={`/api/admin/students/${student.id}/qr?download=1`} className="inline-flex rounded-lg bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white">
              Download PNG
            </a>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Course History</h2>
        <div className="space-y-3">
          {student.enrollments.length === 0 ? (
            <p className="text-sm text-black/60">No courses have been assigned yet.</p>
          ) : (
            student.enrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between rounded-lg border border-black/10 bg-[#f8f8f8] p-3">
                <div>
                  <div className="font-medium">{enrollment.course.name}</div>
                  <div className="text-sm text-black/60">{enrollment.status}</div>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-black/50">{enrollment.course.duration}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
