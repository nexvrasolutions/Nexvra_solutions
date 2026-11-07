import { test, expect, type Page } from '@playwright/test';
import { expectNoHorizontalOverflow, trackPageErrors } from './helpers';

// The marketing site is not served by the admin-only QR deployment
// (QR_ADMIN_ONLY=1, admin.nexvrasolutions.com); see admin-host.spec.ts there.
test.skip(process.env.E2E_QR_ADMIN_ONLY === '1', 'marketing pages are not served by the admin-only deployment');

const PUBLIC_PAGES = [
  '/',
  '/about-us',
  '/solutions',
  '/courses',
  '/projects',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
  '/course-detail/ux-design',
  '/course-detail/front-end-development',
  '/project-detail/magic-aisles',
  '/project-detail/je-mobiles',
];

async function settle(page: Page) {
  await page.waitForLoadState('load');
  // scroll through the page so lazy/animated sections mount and render
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
}

test.describe('public pages', () => {
  for (const path of PUBLIC_PAGES) {
    test(`${path} renders without errors @responsive`, async ({ page }) => {
      const errors = trackPageErrors(page);
      const response = await page.goto(path);
      expect(response?.status(), `HTTP status of ${path}`).toBe(200);
      await expect(page).toHaveTitle(/\S/);
      await settle(page);
      await expectNoHorizontalOverflow(page);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }

  test('internal links and images on public pages resolve', async ({ page, request }) => {
    const checked = new Map<string, number>();
    for (const path of PUBLIC_PAGES) {
      await page.goto(path);
      await settle(page);
      const { links, images } = await page.evaluate(() => ({
        links: Array.from(document.querySelectorAll('a[href^="/"]')).map((a) => a.getAttribute('href')!),
        images: Array.from(document.querySelectorAll('img'))
          .map((img) => img.currentSrc || img.src)
          .filter((src) => src && !src.startsWith('data:') && !src.startsWith('blob:')),
      }));
      for (const url of [...links, ...images]) {
        const key = url.split('#')[0];
        if (!key || checked.has(key)) continue;
        const res = await request.get(key, { maxRedirects: 5 });
        checked.set(key, res.status());
      }
    }
    const broken = [...checked].filter(([, status]) => status >= 400);
    expect(broken, `broken URLs: ${JSON.stringify(broken)}`).toEqual([]);
    expect(checked.size).toBeGreaterThan(10);
  });

  test('unknown course and project slugs return a 404 page', async ({ page }) => {
    const course = await page.goto('/course-detail/does-not-exist');
    expect(course?.status()).toBe(404);
    const project = await page.goto('/project-detail/does-not-exist');
    expect(project?.status()).toBe(404);
    const random = await page.goto('/this-page-does-not-exist');
    expect(random?.status()).toBe(404);
  });

  test('robots.txt and sitemap.xml are served', async ({ request }) => {
    expect((await request.get('/robots.txt')).status()).toBe(200);
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain('<urlset');
  });
});

test.describe('navigation', () => {
  test('hero buttons go to courses and solutions', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Explore Courses/i }).first().click();
    await page.waitForURL('**/courses');
    await page.goto('/');
    await page.getByRole('link', { name: /Our Solutions/i }).first().click();
    await page.waitForURL('**/solutions');
  });

  test('menu opens and every menu item navigates @responsive', async ({ page }) => {
    const targets = ['/about-us', '/solutions', '/courses', '/projects', '/contact', '/'];
    await page.goto('/');
    for (const target of targets) {
      const toggle = page.getByRole('button', { name: 'Open menu' });
      await toggle.click();
      await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible();
      await page.locator(`#staggered-menu-panel a[href="${target}"]`).click();
      await page.waitForURL((url) => url.pathname === target);
    }
  });

  test('menu social links point to real Nexvra profiles', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const hrefs = await page.locator('#staggered-menu-panel a[href^="http"]').evaluateAll((els) =>
      els.map((el) => el.getAttribute('href'))
    );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href, 'placeholder social link').not.toMatch(/^https?:\/\/(www\.)?(twitter|github|linkedin)\.com\/?$/);
    }
  });

  test('course filter buttons filter the course grid', async ({ page }) => {
    await page.goto('/courses');
    const filters = page.locator('section nav button');
    const count = await filters.count();
    expect(count).toBeGreaterThan(1);
    for (let i = 0; i < count; i++) {
      await filters.nth(i).click();
      await expect(page.getByRole('button', { name: /Enroll Now/i }).first()).toBeVisible();
    }
  });

  test('course card links to its detail page', async ({ page }) => {
    await page.goto('/courses');
    const detailLink = page.locator('a[href^="/course-detail/"]').first();
    const href = await detailLink.getAttribute('href');
    await detailLink.click();
    await page.waitForURL(`**${href}`);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});

test.describe('lead forms (external endpoint mocked)', () => {
  test('contact form validates and reports success and failure honestly', async ({ page }) => {
    let status = 500;
    await page.route('https://formsubmit.co/**', (route) => route.fulfill({ status, body: '{}' }));
    await page.goto('/contact');

    await page.getByRole('button', { name: /Send Message/i }).click();
    await expect(page.getByText(/required/i).first()).toBeVisible();

    await page.locator('input[name="name"]').fill('PWTEST Visitor');
    await page.locator('input[name="phone"]').fill('9876543210');
    await page.locator('input[name="email"]').fill('pwtest.visitor@example.com');
    await page.locator('textarea[name="message"]').fill('Automated test message - please ignore.');

    await page.getByRole('button', { name: /Send Message/i }).click();
    await expect(page.getByText(/Failed to send message/i)).toBeVisible();

    status = 200;
    await page.getByRole('button', { name: /Send Message/i }).click();
    await expect(page.getByText(/Message sent successfully/i)).toBeVisible();
  });

  test('enroll modal validates and does not claim success when the request fails @responsive', async ({ page }) => {
    let status = 500;
    await page.route('https://formsubmit.co/**', (route) => route.fulfill({ status, body: '{}' }));
    await page.goto('/courses');
    await page.getByRole('button', { name: /Enroll Now/i }).first().click();
    const modal = page.locator('form').filter({ has: page.locator('[name="course"]') });
    await expect(modal).toBeVisible();

    await modal.locator('button[type="submit"]').click();
    await expect(modal.getByText(/required|valid/i).first()).toBeVisible();

    await modal.locator('[name="name"]').fill('PWTEST Student');
    await modal.locator('[name="email"]').fill('pwtest.student@example.com');
    await modal.locator('[name="phone"]').fill('9876543210');
    const course = modal.locator('[name="course"]');
    if ((await course.evaluate((el) => el.tagName)) === 'SELECT') {
      const value = await course.locator('option').nth(1).getAttribute('value');
      await course.selectOption(value!);
    }

    await modal.locator('button[type="submit"]').click();
    await expect(page.getByText(/Failed to submit application/i)).toBeVisible();
    await expect(page.getByText(/Application submitted successfully/i)).toHaveCount(0);

    status = 200;
    await modal.locator('button[type="submit"]').click();
    await expect(page.getByText(/Application submitted successfully/i)).toBeVisible();
  });
});
