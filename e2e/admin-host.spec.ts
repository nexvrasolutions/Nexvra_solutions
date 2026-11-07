import { test, expect } from '@playwright/test';

/**
 * Only for the admin-only QR deployment (QR_ADMIN_ONLY=1 on the
 * `nexvra-qr-management` project): marketing pages must not be served there.
 */
test.skip(process.env.E2E_QR_ADMIN_ONLY !== '1', 'only for the admin-only deployment (set E2E_QR_ADMIN_ONLY=1)');

const COMPANY_SITE = (process.env.E2E_COMPANY_SITE_URL || 'https://nexvrasolutions.com').replace(/\/+$/, '');

test('"/" opens the admin panel', async ({ request }) => {
  const res = await request.get('/', { maxRedirects: 0 });
  expect([307, 308]).toContain(res.status());
  expect(res.headers()['location']).toMatch(/\/admin$/);
});

for (const path of ['/about-us', '/courses', '/contact', '/course-detail/ui-design']) {
  test(`marketing page ${path} redirects to the company website`, async ({ request }) => {
    const res = await request.get(path, { maxRedirects: 0 });
    expect([307, 308]).toContain(res.status());
    expect(res.headers()['location']).toBe(`${COMPANY_SITE}${path}`);
  });
}

test('QR app routes are served, not redirected', async ({ request }) => {
  for (const path of ['/admin/login', '/verify/0000000000000000000000000000000000000000000000ff']) {
    const res = await request.get(path, { maxRedirects: 0 });
    expect(res.status(), path).not.toBe(308);
    expect(res.headers()['location'] ?? '', path).not.toContain(COMPANY_SITE);
  }
});

test('robots.txt blocks all crawling', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.ok()).toBeTruthy();
  expect(await res.text()).toMatch(/Disallow: \/\s*$/m);
});
