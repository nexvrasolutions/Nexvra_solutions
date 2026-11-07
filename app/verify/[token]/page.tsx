import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { generateStudentQrDataUrl } from '@/lib/qr';
import { formatDateOnly, todayDateOnly } from '@/lib/dates';
import { NEXVRA_PROVIDER } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Student Verification | Nexvra Solutions',
  // Personal records must not end up in search engines.
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  ACTIVE: 'bg-blue-50 text-blue-700 border-blue-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);

export default async function VerifyStudentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{16,128}$/i.test(token)) notFound();

  // Only public fields are loaded: email, contact number and address stay in the admin panel.
  const student = await prisma.student.findUnique({
    where: { profileToken: token },
    select: {
      fullName: true,
      studentCode: true,
      profileToken: true,
      publicProfileEnabled: true,
      studentPhoto: true,
      courseName: true,
      department: true,
      departmentOption: { select: { name: true } },
      instituteName: true,
      learnedFrom: true,
      batchStartDate: true,
      batchEndDate: true,
      batch: true,
      createdAt: true,
      enrollments: {
        select: {
          id: true,
          status: true,
          completionDate: true,
          course: { select: { name: true, code: true, duration: true } },
        },
        orderBy: { enrollmentDate: 'desc' },
      },
    },
  });

  if (!student || !student.publicProfileEnabled) {
    notFound();
  }

  const qrDataUrl = await generateStudentQrDataUrl(student.profileToken);
  const department = student.departmentOption?.name || student.department;
  const completedEnrollments = student.enrollments.filter((e) => e.status === 'COMPLETED').length;

  // Status follows the batch dates; older records without dates fall back to enrollments.
  const batchCompleted = student.batchEndDate ? student.batchEndDate <= todayDateOnly() : null;
  const status =
    batchCompleted === true || (batchCompleted === null && completedEnrollments > 0)
      ? { label: 'Verified · Course Completed', tone: 'border-green-200 bg-green-50 text-green-800', dot: 'bg-green-600' }
      : batchCompleted === false
        ? { label: 'Verified · Course In Progress', tone: 'border-blue-200 bg-blue-50 text-blue-800', dot: 'bg-blue-600' }
        : { label: 'Verified · Registered Student', tone: 'border-[#a4ff00]/40 bg-[#a4ff00]/15 text-[#0a0a0a]', dot: 'bg-[#5c9400]' };

  const details = [
    { label: 'Course Name', value: student.courseName },
    { label: 'Learned From', value: student.learnedFrom || NEXVRA_PROVIDER },
    { label: 'Batch Start Date', value: student.batchStartDate ? formatDateOnly(student.batchStartDate) : null },
    { label: 'Batch Completion Date', value: student.batchEndDate ? formatDateOnly(student.batchEndDate) : null },
    { label: 'Department', value: department },
    { label: 'Institute', value: student.instituteName || NEXVRA_PROVIDER },
    { label: 'Batch', value: student.batch },
    { label: 'Registered On', value: formatDate(student.createdAt) },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-8 text-black sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.2em] text-black/70 hover:text-black">
            Nexvra Solutions
          </Link>
          <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/60">
            Certificate Verification
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {student.studentPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element -- storage URL
                <img
                  src={student.studentPhoto}
                  alt={`${student.fullName} photo`}
                  className="h-28 w-28 shrink-0 rounded-2xl border border-black/10 object-cover sm:h-32 sm:w-32"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.25em] text-black/50">Student Certificate</p>
                <h1 className="mt-2 break-words text-3xl font-bold sm:text-4xl">{student.fullName}</h1>
                <div
                  data-testid="verification-status"
                  className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${status.tone}`}
                >
                  <span className={`inline-flex h-2 w-2 rounded-full ${status.dot}`} aria-hidden="true" />
                  {status.label}
                </div>
              </div>
              <div className="self-start rounded-2xl border border-black/10 bg-[#f8f8f8] px-4 py-2 text-sm font-medium text-black/70">
                ID: {student.studentCode}
              </div>
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {details.map((item) => (
                <div key={item.label} className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4">
                  <dt className="text-xs uppercase tracking-[0.2em] text-black/50">{item.label}</dt>
                  <dd className="mt-2 break-words text-lg font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <aside className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.25em] text-black/50">QR Verification</div>
              <div className="mt-4 flex justify-center rounded-2xl border border-black/10 bg-[#f8f8f8] p-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- inline data URL */}
                <img src={qrDataUrl} alt={`${student.fullName} QR code`} className="h-48 w-48 object-contain" />
              </div>
              <p className="mt-4 text-sm text-black/60">
                This certificate was issued by {NEXVRA_PROVIDER}. The QR code links to this verification page.
              </p>
            </div>
          </aside>
        </div>

        {student.enrollments.length > 0 ? (
          <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">Course Records</h2>
              <span className="text-sm text-black/60">{student.enrollments.length} course(s)</span>
            </div>
            <ul className="space-y-4">
              {student.enrollments.map((enrollment) => (
                <li
                  key={enrollment.id}
                  className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="break-words text-lg font-semibold">{enrollment.course.name}</div>
                    <div className="text-sm text-black/60">{enrollment.course.code}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] ${
                        STATUS_STYLES[enrollment.status] ?? 'border-black/10 bg-white text-black/70'
                      }`}
                    >
                      {enrollment.status}
                    </span>
                    {enrollment.completionDate ? (
                      <span className="text-sm text-black/60">Completed: {formatDate(enrollment.completionDate)}</span>
                    ) : null}
                    <span className="text-sm text-black/60">{enrollment.course.duration || 'Self-paced'}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
