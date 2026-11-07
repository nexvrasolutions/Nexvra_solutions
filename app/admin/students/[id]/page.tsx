import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { StudentForm } from '@/components/admin/student-form';
import { EnrollmentForm, EnrollmentList } from '@/components/admin/enrollment-form';
import { DeleteButton } from '@/components/admin/delete-button';
import { requireAdminSession } from '@/lib/auth';
import { getStudentFormOptions } from '@/lib/student-options';
import { formatDateOnly, toDateInput } from '@/lib/dates';

export default async function StudentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const justCreated = (await searchParams).created === '1';

  const [student, courses, options] = await Promise.all([
    prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: { include: { course: true }, orderBy: { enrollmentDate: 'desc' } },
        departmentOption: true,
      },
    }),
    prisma.course.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, isActive: true } }),
    getStudentFormOptions(),
  ]);

  if (!student) notFound();

  const department = student.departmentOption?.name || student.department;
  const missingCertificateData = !student.courseName || !student.batchStartDate || !student.batchEndDate;
  const details: { label: string; value: string | null; private?: boolean }[] = [
    { label: 'Course Name', value: student.courseName },
    { label: 'Department', value: department },
    { label: 'Institute', value: student.instituteName },
    { label: 'Learned From', value: student.learnedFrom },
    { label: 'Batch Start Date', value: student.batchStartDate ? formatDateOnly(student.batchStartDate) : null },
    { label: 'Batch Completion Date', value: student.batchEndDate ? formatDateOnly(student.batchEndDate) : null },
    { label: 'Batch Name / Code', value: student.batch },
    { label: 'Email Address', value: student.email, private: true },
    { label: 'Contact Number', value: student.phone, private: true },
    { label: 'Address', value: student.address, private: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">Student · {student.studentCode}</p>
          <h1 className="mt-2 break-words text-3xl font-bold">{student.fullName}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {student.publicProfileEnabled ? (
            <a
              href={`/verify/${student.profileToken}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium"
            >
              View public page
            </a>
          ) : null}
          <Link href="/admin/students" className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium">
            Back to list
          </Link>
        </div>
      </div>

      {justCreated ? (
        <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Student created successfully. Their QR code is ready below.
        </div>
      ) : null}
      {missingCertificateData ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This record was created before course name and batch dates were required. Add them below and click Update
          Student so the verification page is complete.
        </div>
      ) : null}

      <section aria-labelledby="student-details-heading" className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 id="student-details-heading" className="mb-4 text-xl font-semibold">
          Student Details
        </h2>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-[#f5f5f5]">
            {student.studentPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element -- storage URL
              <img src={student.studentPhoto} alt={`${student.fullName} photo`} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-black/45">No photo</span>
            )}
          </div>
          <dl className="grid flex-1 gap-3 sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.label} className="min-w-0 rounded-lg border border-black/10 bg-[#f8f8f8] px-3 py-2">
                <dt className="text-xs uppercase tracking-[0.15em] text-black/50">
                  {item.label}
                  {item.private ? <span className="ml-1 normal-case tracking-normal text-black/40">(admin only)</span> : null}
                </dt>
                <dd className="mt-1 break-words text-sm font-medium">{item.value || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div>
        <h2 className="mb-3 text-xl font-semibold">Edit Student</h2>
        <StudentForm
        mode="edit"
        options={options}
        initialData={{
          id: student.id,
          fullName: student.fullName,
          email: student.email,
          phone: student.phone,
          address: student.address,
          studentPhoto: student.studentPhoto,
          courseName: student.courseName,
          department: student.department,
          departmentId: student.departmentId,
          batchStartDate: toDateInput(student.batchStartDate),
          batchEndDate: toDateInput(student.batchEndDate),
          batch: student.batch,
          programType: student.programType ?? 'COURSE',
          programTypeOptionId: student.programTypeOptionId,
          publicProfileEnabled: student.publicProfileEnabled,
        }}
        />
      </div>

      <EnrollmentForm studentId={student.id} courses={courses} />

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Student QR</h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="self-start overflow-hidden rounded-xl border border-black/10 bg-[#f8f8f8] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- authenticated API image */}
            <img
              src={`/api/admin/students/${student.id}/qr`}
              alt={`${student.fullName} QR code`}
              className="h-40 w-40 object-contain"
            />
          </div>
          <div className="space-y-2 md:text-right">
            <a
              href={`/api/admin/students/${student.id}/qr?download=1`}
              className="inline-flex rounded-lg bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white"
            >
              Download PNG
            </a>
            {!student.publicProfileEnabled ? (
              <p className="text-sm text-amber-700">Public profile is disabled, so this QR currently shows “not found”.</p>
            ) : null}
          </div>
        </div>
      </section>

      <EnrollmentList
        studentId={student.id}
        enrollments={student.enrollments.map((e) => ({
          id: e.id,
          status: e.status,
          courseName: e.course.name,
          duration: e.course.duration,
          completionDate: e.completionDate?.toISOString() ?? null,
        }))}
      />

      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-red-700">Danger zone</h2>
        <p className="mt-2 text-sm text-black/60">
          Deleting the student removes their enrollments and permanently invalidates their QR code.
        </p>
        <div className="mt-4">
          <DeleteButton
            endpoint={`/api/admin/students/${student.id}`}
            label="Delete Student"
            confirmText={`Delete ${student.fullName}? Their QR code will stop working. This cannot be undone.`}
            redirectTo="/admin/students"
          />
        </div>
      </section>
    </div>
  );
}
