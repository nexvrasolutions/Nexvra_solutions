import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth';

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  await requireAdminSession();
  const params = await searchParams;
  const search = params.search || '';

  const students = await prisma.student.findMany({
    where: search
      ? {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { institution: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      enrollments: {
        include: { course: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">Students</p>
          <h1 className="mt-2 text-3xl font-bold">Student Management</h1>
        </div>

        <Link href="/admin/students/new" className="rounded-lg bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white hover:bg-black">
          + Add Student
        </Link>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <form method="GET" className="flex gap-3">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by name, email or institution"
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          />
          <button type="submit" className="rounded-lg border border-black/10 bg-[#0a0a0a] px-4 py-2.5 text-sm text-white">
            Search
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-black/10 text-left">
          <thead className="bg-[#f8f8f8] text-sm uppercase tracking-wide text-black/60">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Courses</th>
              <th className="px-4 py-3">QR</th>
              <th className="px-4 py-3">Profile</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-black/10 align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{student.fullName}</div>
                  <div className="text-sm text-black/60">{student.email}</div>
                </td>
                <td className="px-4 py-3 text-sm text-black/70">{student.batch || '—'}</td>
                <td className="px-4 py-3 text-sm text-black/70">{student.enrollments.length}</td>
                <td className="px-4 py-3">
                  <a href={`/api/admin/students/${student.id}/qr?download=1`} className="text-sm font-medium text-[#0a0a0a] underline">
                    Download PNG
                  </a>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/students/${student.id}`} className="text-sm font-medium underline">Edit</Link>
                    <a href={`/students/${student.profileToken}`} target="_blank" rel="noreferrer" className="text-sm font-medium underline">
                      View public
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
