import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth';
import { DeleteButton } from '@/components/admin/delete-button';
import { formatDateOnly, parseDateOnly } from '@/lib/dates';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const fieldClass = 'w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]';

type SearchParams = { search?: string; department?: string; from?: string; to?: string };

export default async function StudentsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdminSession();
  const params = await searchParams;
  const search = (params.search || '').trim();
  const department = (params.department || '').trim();
  const from = DATE_RE.test(params.from || '') ? params.from! : '';
  const to = DATE_RE.test(params.to || '') ? params.to! : '';
  const filtered = Boolean(search || department || from || to);

  // Contact numbers are matched on digits only, so "98765 43210", "9876543210"
  // and "+91-98765-43210" all find the same student.
  const searchDigits = search.replace(/\D/g, '');
  const phoneMatches =
    searchDigits.length >= 4
      ? await prisma.$queryRaw<{ id: string }[]>`
          SELECT "id" FROM "Student"
          WHERE regexp_replace(COALESCE("phone", ''), '[^0-9]', '', 'g') LIKE ${'%' + searchDigits + '%'}`
      : [];

  const and: Prisma.StudentWhereInput[] = [];
  if (search) {
    and.push({
      OR: [
        { fullName: { contains: search, mode: 'insensitive' } },
        { courseName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        ...(phoneMatches.length ? [{ id: { in: phoneMatches.map((m) => m.id) } }] : []),
        { studentCode: { contains: search, mode: 'insensitive' } },
        { batch: { contains: search, mode: 'insensitive' } },
        { enrollments: { some: { course: { name: { contains: search, mode: 'insensitive' } } } } },
      ],
    });
  }
  if (department) {
    and.push({
      OR: [
        { department: { equals: department, mode: 'insensitive' } },
        { departmentOption: { name: { equals: department, mode: 'insensitive' } } },
      ],
    });
  }
  // Batch filters: batches that started on/after "from" and were completed on/before "to".
  if (from) and.push({ batchStartDate: { gte: parseDateOnly(from) } });
  if (to) and.push({ batchEndDate: { lte: parseDateOnly(to) } });

  const [students, departmentOptions, usedDepartments] = await Promise.all([
    prisma.student.findMany({
      where: and.length ? { AND: and } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        studentCode: true,
        studentPhoto: true,
        courseName: true,
        department: true,
        batch: true,
        batchStartDate: true,
        batchEndDate: true,
        profileToken: true,
        publicProfileEnabled: true,
        departmentOption: { select: { name: true } },
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.department.findMany({ orderBy: { name: 'asc' }, select: { name: true } }),
    prisma.student.findMany({
      where: { department: { not: null } },
      distinct: ['department'],
      select: { department: true },
    }),
  ]);

  const departments = Array.from(
    new Set([...departmentOptions.map((d) => d.name), ...usedDepartments.map((d) => d.department!).filter(Boolean)])
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">Students</p>
          <h1 className="mt-2 text-3xl font-bold">Student Management</h1>
        </div>

        <Link href="/admin/students/new" className="self-start rounded-lg bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white hover:bg-black sm:self-auto">
          + Add Student
        </Link>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <form method="GET" role="search" className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-end">
          <div>
            <label htmlFor="student-search" className="mb-1 block text-xs font-medium text-black/60">
              Search students
            </label>
            <input
              id="student-search"
              name="search"
              defaultValue={search}
              placeholder="Search by name, course, email or contact number"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="filter-department" className="mb-1 block text-xs font-medium text-black/60">
              Department
            </label>
            <select id="filter-department" name="department" defaultValue={department} className={fieldClass}>
              <option value="">All departments</option>
              {departments.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-from" className="mb-1 block text-xs font-medium text-black/60">
              Batch starts on/after
            </label>
            <input id="filter-from" name="from" type="date" defaultValue={from} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="filter-to" className="mb-1 block text-xs font-medium text-black/60">
              Batch completes on/before
            </label>
            <input id="filter-to" name="to" type="date" defaultValue={to} className={fieldClass} />
          </div>
          <button type="submit" className="rounded-lg border border-black/10 bg-[#0a0a0a] px-4 py-2.5 text-sm text-white">
            Search
          </button>
        </form>
        <p className="mt-3 text-sm text-black/60">
          {filtered ? (
            <>
              {students.length} result(s){search ? <> for &ldquo;{search}&rdquo;</> : null}.{' '}
              <Link href="/admin/students" className="underline">
                Clear filters
              </Link>
            </>
          ) : (
            <>{students.length} registered student(s).</>
          )}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-sm">
        <table className="min-w-[960px] divide-y divide-black/10 text-left">
          <thead className="bg-[#f8f8f8] text-sm uppercase tracking-wide text-black/60">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">QR</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-black/60">
                  {filtered ? 'No students match your search.' : 'No students yet. Add the first one.'}
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-t border-black/10 align-top">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-[#f5f5f5] text-xs font-semibold text-black/50">
                        {student.studentPhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element -- storage URL
                          <img src={student.studentPhoto} alt="" className="h-full w-full object-cover" />
                        ) : (
                          student.fullName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">{student.fullName}</div>
                        <div className="text-xs text-black/40">{student.studentCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-black/70">
                    {student.courseName || <span className="text-black/40">Not set</span>}
                    {student._count.enrollments ? (
                      <div className="text-xs text-black/40">{student._count.enrollments} catalog enrollment(s)</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-sm text-black/70">
                    {student.departmentOption?.name || student.department || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-black/70">
                    {student.batchStartDate && student.batchEndDate ? (
                      <div className="whitespace-nowrap">
                        {formatDateOnly(student.batchStartDate)} – {formatDateOnly(student.batchEndDate)}
                      </div>
                    ) : (
                      <span className="text-black/40">Dates not set</span>
                    )}
                    {student.batch ? <div className="text-xs text-black/40">{student.batch}</div> : null}
                  </td>
                  <td className="px-4 py-3 text-sm text-black/70">
                    <div>{student.email || '—'}</div>
                    <div className="text-xs text-black/50">{student.phone || ''}</div>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/api/admin/students/${student.id}/qr?download=1`} className="text-sm font-medium text-[#0a0a0a] underline">
                      Download PNG
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-start gap-3">
                      <Link href={`/admin/students/${student.id}`} className="text-sm font-medium underline">
                        View / Edit
                      </Link>
                      {student.publicProfileEnabled ? (
                        <a
                          href={`/verify/${student.profileToken}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium underline"
                        >
                          View public
                        </a>
                      ) : (
                        <span className="text-sm text-black/40">Hidden</span>
                      )}
                      <DeleteButton
                        endpoint={`/api/admin/students/${student.id}`}
                        label="Delete"
                        confirmText={`Delete ${student.fullName}? Their QR code will stop working. This cannot be undone.`}
                        className="text-sm font-medium text-red-600 underline disabled:opacity-60"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
