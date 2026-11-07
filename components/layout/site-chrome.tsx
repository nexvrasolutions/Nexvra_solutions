'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/footer';
import LazyLoader from '@/components/ui/lazy-loader';

/** Routes that are tools rather than marketing pages: no intro loader, no marketing footer. */
export const APP_ROUTE_PREFIXES = ['/admin', '/verify', '/students'];

export function isAppRoute(pathname: string | null) {
  return Boolean(pathname && APP_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`)));
}

export function SiteLoader() {
  return isAppRoute(usePathname()) ? null : <LazyLoader />;
}

export function SiteFooter() {
  return isAppRoute(usePathname()) ? null : <Footer />;
}
