import { test, expect, type APIRequestContext } from '@playwright/test';
import { adminCredentials, uniqueSuffix } from './helpers';

/**
 * Shared login rate limiting (lib/rate-limit.ts).
 * Only made-up @example.com addresses are locked out, so the real test admin
 * is never blocked. Lockout expiry and cross-instance sharing need database
 * access and are covered by the separate session/throttle script tests.
 */
const LIMIT_PER_IP_AND_EMAIL = 5;
const GENERIC_LOCKOUT = 'Too many sign-in attempts. Please wait a few minutes and try again.';
const fakeEmail = (tag: string) => `pwtest.ratelimit.${tag}.${uniqueSuffix().toLowerCase()}@example.com`;

const attempt = (api: APIRequestContext, email: string, password = `wrong-${Math.random()}`, headers: Record<string, string> = {}) =>
  api.post('/api/admin/login', { data: { email, password }, headers });

test.describe('login rate limiting', () => {
  test('unknown email and wrong password get the identical generic answer', async ({ request }) => {
    const unknown = await attempt(request, fakeEmail('unknown'));
    // One wrong attempt on the real account (well below its limits).
    const wrongPassword = await attempt(request, adminCredentials().email);
    expect(unknown.status()).toBe(401);
    expect(wrongPassword.status()).toBe(401);
    expect(await unknown.json()).toEqual(await wrongPassword.json());
    expect(await unknown.json()).toEqual({ message: 'Invalid credentials.' });
  });

  test('a burst of parallel guesses lets exactly 5 through, then answers 429 with Retry-After', async ({ request }) => {
    const email = fakeEmail('burst');
    const results = await Promise.all(Array.from({ length: 10 }, () => attempt(request, email)));
    const statuses = results.map((r) => r.status()).sort();
    expect(statuses.filter((s) => s === 401)).toHaveLength(LIMIT_PER_IP_AND_EMAIL);
    expect(statuses.filter((s) => s === 429)).toHaveLength(10 - LIMIT_PER_IP_AND_EMAIL);

    const blocked = results.find((r) => r.status() === 429)!;
    expect(await blocked.json()).toEqual({ message: GENERIC_LOCKOUT });
    const retryAfter = Number(blocked.headers()['retry-after']);
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(15 * 60); // never longer than the 15-minute window

    // Still blocked on the next sequential attempt, with the same generic text.
    const again = await attempt(request, email);
    expect(again.status()).toBe(429);
    expect(await again.json()).toEqual({ message: GENERIC_LOCKOUT });
  });

  test('a lockout on one email does not block other accounts from the same network', async ({ request }) => {
    const locked = fakeEmail('locked');
    for (let i = 0; i < LIMIT_PER_IP_AND_EMAIL; i++) expect((await attempt(request, locked)).status()).toBe(401);
    expect((await attempt(request, locked)).status()).toBe(429);
    expect((await attempt(request, fakeEmail('neighbour'))).status()).toBe(401);
  });

  test('email case and spacing do not create extra attempts', async ({ request }) => {
    const email = fakeEmail('case');
    const variants = [email, email.toUpperCase(), ` ${email} `, email.replace('pwtest', 'PWTest'), email, email.toUpperCase()];
    const statuses: number[] = [];
    for (const v of variants) statuses.push((await attempt(request, v)).status());
    expect(statuses.slice(0, LIMIT_PER_IP_AND_EMAIL)).toEqual(Array(LIMIT_PER_IP_AND_EMAIL).fill(401));
    expect(statuses[LIMIT_PER_IP_AND_EMAIL]).toBe(429);
  });

  test('a spoofed X-Forwarded-For header does not reset the counter (Vercel only)', async ({ request, baseURL }) => {
    test.skip(!baseURL?.startsWith('https://'), 'locally the client controls X-Forwarded-For; on Vercel the platform overwrites it');
    const email = fakeEmail('spoof');
    const statuses: number[] = [];
    for (let i = 0; i < LIMIT_PER_IP_AND_EMAIL + 2; i++) {
      const fakeIp = `203.0.113.${10 + i}`;
      const res = await attempt(request, email, undefined, { 'x-forwarded-for': fakeIp, 'x-real-ip': fakeIp, 'x-vercel-forwarded-for': fakeIp });
      statuses.push(res.status());
    }
    expect(statuses.slice(0, LIMIT_PER_IP_AND_EMAIL)).toEqual(Array(LIMIT_PER_IP_AND_EMAIL).fill(401));
    expect(statuses.slice(LIMIT_PER_IP_AND_EMAIL)).toEqual([429, 429]);
  });

  test('the login form shows the generic lockout message', async ({ page }) => {
    const email = fakeEmail('form');
    for (let i = 0; i < LIMIT_PER_IP_AND_EMAIL; i++) await attempt(page.request, email);
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('wrong-password-form');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText(GENERIC_LOCKOUT)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
