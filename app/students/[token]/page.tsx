import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { generateStudentQrPng } from '@/lib/qr';

export const dynamic = 'force-dynamic';

export default async function StudentPublicProfilePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const student = await prisma.student.findUnique({
    where: { profileToken: token },
    include: {
      enrollments: {
        include: { course: true },
      },
    },
  });

  if (!student || !student.publicProfileEnabled) {
    notFound();
  }

  const qrPath = await generateStudentQrPng(student.profileToken);

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-12 text-black">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium uppercase tracking-[0.2em] text-black/60 hover:text-black">
            Nexvra Solutions
          </Link>
          <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/60">
            Student Profile
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-black/50">Student</p>
                <h1 className="mt-3 text-4xl font-bold">{student.fullName}</h1>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] px-4 py-2 text-sm font-medium text-black/70">
                Code: {student.studentCode}
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-black/50">Email</div>
                <div className="mt-2 text-lg font-medium">{student.email}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-black/50">Phone</div>
                <div className="mt-2 text-lg font-medium">{student.phone}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-black/50">Institution</div>
                <div className="mt-2 text-lg font-medium">{student.institution || 'Not specified'}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-black/50">Department</div>
                <div className="mt-2 text-lg font-medium">{student.department || 'Not specified'}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-black/50">Batch</div>
                <div className="mt-2 text-lg font-medium">{student.batch || 'Not specified'}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-black/50">Profile</div>
                <div className="mt-2 text-lg font-medium">{student.publicProfileEnabled ? 'Public' : 'Hidden'}</div>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.25em] text-black/50">QR Access</div>
              <div className="mt-4 flex justify-center rounded-2xl border border-black/10 bg-[#f8f8f8] p-4">
                <img src={qrPath} alt={`${student.fullName} QR code`} className="h-48 w-48 object-contain" />
              </div>
              <p className="mt-4 text-sm text-black/60">
                This QR can be used to access the student’s public profile.
              </p>
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Course Enrollments</h2>
            <span className="text-sm text-black/60">{student.enrollments.length} total</span>
          </div>

          {student.enrollments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 bg-[#f8f8f8] p-6 text-center text-black/60">
              No courses assigned yet.
            </div>
          ) : (
            <div className="space-y-4">
              {student.enrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-semibold">{enrollment.course.name}</div>
                    <div className="text-sm text-black/60">{enrollment.course.code}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs uppercase tracking-[0.15em] text-black/70">
                      {enrollment.status}
                    </span>
                    <span className="text-sm text-black/60">{enrollment.course.duration || 'Self-paced'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
