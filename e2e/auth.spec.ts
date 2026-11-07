import { test, expect } from '@playwright/test';
import { adminCredentials } from './helpers';

const PROTECTED_PAGES = [
  '/admin',
  '/admin/dashboard',
  '/admin/students',
  '/admin/students/new',
  '/admin/courses',
  '/admin/courses/new',
  '/admin/options',
];

const PROTECTED_APIS: [string, string][] = [
  ['GET', '/api/admin/students'],
  ['POST', '/api/admin/students'],
  ['GET', '/api/admin/students/some-id'],
  ['PUT', '/api/admin/students/some-id'],
  ['DELETE', '/api/admin/students/some-id'],
  ['GET', '/api/admin/students/some-id/qr'],
  ['POST', '/api/admin/students/some-id/enrollments'],
  ['GET', '/api/admin/courses'],
  ['POST', '/api/admin/courses'],
  ['PUT', '/api/admin/courses/some-id'],
  ['DELETE', '/api/admin/courses/some-id'],
  ['POST', '/api/admin/upload'],
  ['GET', '/api/admin/options/departments'],
  ['POST', '/api/admin/options/institutions'],
  ['DELETE', '/api/admin/options/program-types/some-id'],
];

test.describe('unauthenticated access', () => {
  for (const path of PROTECTED_PAGES) {
    test(`${path} redirects to the login page`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/admin\/login$/);
      await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
    });
  }

  test('admin APIs reject requests without a session', async ({ request }) => {
    const results: string[] = [];
    for (const [method, url] of PROTECTED_APIS) {
      const res = await request.fetch(url, { method, data: method === 'GET' ? undefined : {} });
      if (res.status() !== 401) results.push(`${method} ${url} -> ${res.status()}`);
    }
    expect(results, results.join('\n')).toEqual([]);
  });

  test('a forged session cookie is rejected', async ({ page, context, baseURL }) => {
    const forged =
      'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJ4IiwiZW1haWwiOiJ4QHguY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIn0.invalidsignature';
    await context.addCookies([{ name: 'nexvra_admin_session', value: forged, url: baseURL! }]);
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login$/);
    const api = await page.request.get('/api/admin/students');
    expect(api.status()).toBe(401);
  });
});

test.describe('login form', () => {
  test('does not prefill any email address', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByLabel('Email')).toHaveValue('');
  });

  test('rejects a wrong password', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill('pwtest.nobody@example.com');
    await page.getByLabel('Password').fill('definitely-wrong-password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid credentials.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('login API validates its input', async ({ request }) => {
    const bad = await request.post('/api/admin/login', { data: { email: 'not-an-email', password: 'x' } });
    expect(bad.status()).toBe(400);
    const empty = await request.post('/api/admin/login', { data: {} });
    expect(empty.status()).toBe(400);
    const notJson = await request.post('/api/admin/login', {
      headers: { 'content-type': 'application/json' },
      data: '{not json',
    });
    expect(notJson.status()).toBe(400);
  });

  test('email is matched case-insensitively and logout ends the session', async ({ page, context }) => {
    const { email, password } = adminCredentials();
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill(email.toUpperCase());
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/admin/dashboard');

    const cookie = (await context.cookies()).find((c) => c.name === 'nexvra_admin_session');
    expect(cookie, 'session cookie set').toBeTruthy();
    expect(cookie!.httpOnly).toBe(true);
    expect(cookie!.sameSite).toBe('Lax');

    await page.getByRole('button', { name: 'Logout' }).first().click();
    await page.waitForURL('**/admin/login');
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();

    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('repeated failed logins are throttled', async ({ request }) => {
    const email = `pwtest.bruteforce.${Date.now()}@example.com`;
    let throttled = false;
    for (let i = 0; i < 12; i++) {
      const res = await request.post('/api/admin/login', { data: { email, password: `wrong-password-${i}` } });
      if (res.status() === 429) {
        throttled = true;
        break;
      }
      expect(res.status()).toBe(401);
    }
    expect(throttled, 'login should be rate limited after repeated failures').toBe(true);
  });
});
