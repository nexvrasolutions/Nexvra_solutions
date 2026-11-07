import fs from 'node:fs';
import path from 'node:path';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import { expect, type APIRequestContext, type Page } from '@playwright/test';

export const ADMIN_STATE = path.join(__dirname, '.auth', 'admin.json');
/** Anonymous visitor state: empty locally, or only Vercel's preview bypass cookie (see global-setup.ts). */
export const BYPASS_STATE = path.join(__dirname, '.auth', 'visitor.json');
export const TEST_PREFIX = 'PWTEST';

export function adminCredentials() {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run the admin tests.');
  }
  return { email, password };
}

export function uniqueSuffix() {
  return `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`.toUpperCase();
}

/** Console messages that come from the dev tooling, not from the app. */
const IGNORED_CONSOLE = [
  /Download the React DevTools/i,
  /\[HMR\]/,
  /\[Fast Refresh\]/,
  /webpack-hmr|turbopack-hmr|_next\/webpack-hmr/i,
  /formsubmit\.co/i, // external form endpoint is mocked/blocked in tests
];

/** Collects console errors and uncaught page errors for the lifetime of a page. */
export function trackPageErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (IGNORED_CONSOLE.some((re) => re.test(text))) return;
    errors.push(`console.error: ${text}`);
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

/** Fails if the page is wider than the viewport (horizontal scroll). */
export async function expectNoHorizontalOverflow(page: Page) {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth, `page is ${scrollWidth}px wide in a ${innerWidth}px viewport`).toBeLessThanOrEqual(innerWidth + 1);
}

/** Decodes a QR code PNG buffer and returns the encoded text. */
export function decodeQrPng(buffer: Buffer) {
  const png = PNG.sync.read(buffer);
  const result = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  if (!result) throw new Error('No QR code found in image.');
  return result.data;
}

export async function expectImageLoaded(page: Page, selector: string) {
  const img = page.locator(selector).first();
  await expect(img).toBeVisible();
  await expect
    .poll(async () => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), {
      message: `image ${selector} should load`,
    })
    .toBe(true);
}

/**
 * Removes records the suite created. Only touches PWTEST-prefixed data.
 * Pass the spec's run tag so parallel workers only remove their own records;
 * without one (global teardown) every PWTEST record is removed.
 */
export async function cleanupTestData(api: APIRequestContext, runTag?: string) {
  const removed: string[] = [];
  const mine = (value: string) => value.startsWith(TEST_PREFIX) && (!runTag || value.toUpperCase().includes(runTag.toUpperCase()));

  const students = await api.get('/api/admin/students');
  if (students.ok()) {
    const body = await students.json();
    for (const s of body.students as { id: string; fullName: string; email: string | null }[]) {
      // Email is optional now; test students always carry the PWTEST name prefix.
      if (mine(s.fullName) && (!s.email || s.email.endsWith('@example.com'))) {
        await api.delete(`/api/admin/students/${s.id}`);
        removed.push(`student ${s.fullName}`);
      }
    }
  }

  const courses = await api.get('/api/admin/courses');
  if (courses.ok()) {
    const body = await courses.json();
    for (const c of body.courses as { id: string; code: string }[]) {
      if (mine(c.code)) {
        await api.delete(`/api/admin/courses/${c.id}`);
        removed.push(`course ${c.code}`);
      }
    }
  }

  for (const [endpoint, key] of [
    ['departments', 'departments'],
    ['institutions', 'institutions'],
    ['program-types', 'programTypes'],
  ] as const) {
    const res = await api.get(`/api/admin/options/${endpoint}`);
    if (!res.ok()) continue;
    const body = await res.json();
    for (const o of body[key] as { id: string; name: string }[]) {
      if (mine(o.name)) {
        await api.delete(`/api/admin/options/${endpoint}/${o.id}`);
        removed.push(`${endpoint} ${o.name}`);
      }
    }
  }

  return removed;
}

export function fixturePath(name: string) {
  return path.join(__dirname, 'fixtures', name);
}

export function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}
