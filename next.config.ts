import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // lib/prisma.ts reads the Supabase CA from disk at runtime; make sure the
  // file is shipped with every server function (e.g. on Vercel).
  outputFileTracingIncludes: {
    "/**": ["./supabase-ca.cer/prod-ca-2021.crt"],
  },
  poweredByHeader: false,
  // QR_ADMIN_ONLY=1 is set only on the separate `nexvra-qr-management` Vercel
  // project (admin.nexvrasolutions.com). There the marketing pages are not
  // served: "/" opens the admin panel and every other page goes to the company
  // website. Evaluated at build time, so the company site build is unaffected.
  async redirects() {
    if (process.env.QR_ADMIN_ONLY !== "1") return [];
    const companySite = (process.env.COMPANY_SITE_URL || "https://nexvrasolutions.com").replace(/\/+$/, "");
    return [
      { source: "/", destination: "/admin", permanent: false },
      {
        // Everything except the QR app, its APIs and static assets.
        source: "/:path((?!admin|verify|students|api|_next|images|fonts|favicon\\.ico|robots\\.txt).+)",
        destination: `${companySite}/:path`,
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HSTS is sent by Vercel itself; not set here so other subdomains are unaffected.
        ],
      },
      {
        // Admin pages and APIs carry personal data: never cache them in shared caches.
        source: "/(admin|api/admin)/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
    ];
  },
};

export default nextConfig;
