'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/students', label: 'Students' },
  { href: '/admin/students/new', label: 'Add Student' },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/courses/new', label: 'Add Course' },
  { href: '/admin/options', label: 'Option Management', superAdminOnly: true },
];

function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  // "/admin/students" is active on a student's detail page, but not on "/admin/students/new".
  return (
    pathname.startsWith(`${href}/`) &&
    !LINKS.some((l) => l.href !== href && (pathname === l.href || pathname.startsWith(`${l.href}/`)) && l.href.length > href.length)
  );
}

export function AdminNav({ isSuperAdmin, variant }: { isSuperAdmin: boolean; variant: 'sidebar' | 'bar' }) {
  const pathname = usePathname() || '';
  const links = LINKS.filter((l) => !l.superAdminOnly || isSuperAdmin);

  if (variant === 'bar') {
    return (
      <nav aria-label="Admin" className="flex gap-2 overflow-x-auto border-b border-black/10 bg-[#0a0a0a] px-4 py-3 lg:hidden">
        {links.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm ${
                active ? 'border-[#a4ff00] bg-[#a4ff00] text-black' : 'border-white/15 bg-white/5 text-white'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Admin" className="space-y-2 text-sm">
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`block rounded-md border px-3 py-2 ${
              active ? 'border-[#a4ff00]/60 bg-[#a4ff00]/15 text-white' : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
