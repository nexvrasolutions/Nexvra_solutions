import type { Metadata } from 'next';
import { getActiveAdminFromCookies } from '@/lib/auth';
import { AdminNav } from '@/components/admin/admin-nav';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getActiveAdminFromCookies();

  // Signed-out visitors only ever reach /admin/login (the proxy redirects everything else).
  if (!admin) {
    return children;
  }

  const isSuperAdmin = admin.role === 'SUPER_ADMIN';

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-black/10 bg-[#0a0a0a] p-6 text-white lg:flex">
          <div className="mb-8">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a4ff00]">Nexvra</div>
            <p className="mt-2 text-2xl font-bold">Admin Panel</p>
          </div>

          <AdminNav isSuperAdmin={isSuperAdmin} variant="sidebar" />

          <div className="mt-auto rounded-lg border border-[#a4ff00]/30 bg-[#a4ff00]/10 p-4 text-sm text-white/80">
            <div className="font-medium text-white">{admin.fullName}</div>
            <div className="text-xs uppercase tracking-wide text-[#a4ff00]">{admin.role.replace('_', ' ')}</div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-4 shadow-sm sm:px-6">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.25em] text-black/50">Nexvra Solutions</p>
              <p className="truncate text-lg font-semibold sm:text-xl">Student QR Management</p>
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

          <AdminNav isSuperAdmin={isSuperAdmin} variant="bar" />

          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
