import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth';

export default async function AdminDashboardPage() {
  await requireAdminSession();

  const [studentsCount, activeStudents, coursesCount, enrollmentsCount, completedEnrollments, recentStudents] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { publicProfileEnabled: true } }),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: 'COMPLETED' } }),
    prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    }),
  ]);

  const stats = [
    { label: 'Total Students', value: studentsCount },
    { label: 'Active Profiles', value: activeStudents },
    { label: 'Course Catalog', value: coursesCount },
    { label: 'Enrollments', value: enrollmentsCount },
    { label: 'Completed', value: completedEnrollments },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-sm text-black/60">{stat.label}</div>
            <div className="mt-3 text-3xl font-bold text-[#0a0a0a]">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recent Students</h3>
        </div>

        {recentStudents.length === 0 ? (
          <p className="text-sm text-black/60">No students have been registered yet.</p>
        ) : (
          <div className="space-y-3">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between border-b border-black/10 py-3 last:border-b-0">
                <div>
                  <div className="font-medium">{student.fullName}</div>
                  <div className="text-sm text-black/60">{student.email}</div>
                </div>
                <div className="text-sm text-black/60">
                  {new Date(student.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
