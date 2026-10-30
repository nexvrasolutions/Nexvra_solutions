import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  const admin = session
    ? await prisma.adminUser.findUnique({ where: { id: session.userId } })
    : null;

  if (!admin?.isActive) {
    return children;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-black/10 bg-[#0a0a0a] p-6 text-white lg:flex">
          <div className="mb-8">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a4ff00]">
              Nexvra
            </div>
            <h1 className="mt-2 text-2xl font-bold">Admin Panel</h1>
          </div>

          <nav className="space-y-2 text-sm">
            <Link href="/admin/dashboard" className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10">
              Dashboard
            </Link>
            <Link href="/admin/students" className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10">
              Students
            </Link>
            <Link href="/admin/students/new" className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10">
              Add Student
            </Link>
            <Link href="/admin/courses" className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10">
              Courses
            </Link>
            <Link href="/admin/courses/new" className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10">
              Add Course
            </Link>
          </nav>

          <div className="mt-auto rounded-lg border border-[#a4ff00]/30 bg-[#a4ff00]/10 p-4 text-sm text-white/80">
            <div className="font-medium text-white">{admin.fullName}</div>
            <div className="text-xs uppercase tracking-wide text-[#a4ff00]">{admin.role}</div>
          </div>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-4 shadow-sm sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-black/50">Nexvra Solutions</p>
              <h2 className="text-xl font-semibold">Student QR Management</h2>
            </div>

            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="rounded-md bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
              >
                Logout
              </button>
            </form>
          </header>

          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
