import fs from 'node:fs';
import path from 'node:path';
import { test as setup, expect, request } from '@playwright/test';
import { ADMIN_STATE, adminCredentials, ensureDir } from './helpers';

setup('log in as admin through the login form', async ({ page, baseURL }) => {
  const haveCredentials = Boolean(process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD);

  // Without credentials, reuse a previously saved session if the server still accepts it.
  if (!haveCredentials && fs.existsSync(ADMIN_STATE)) {
    const api = await request.newContext({ baseURL, storageState: ADMIN_STATE });
    const res = await api.get('/api/admin/students');
    await api.dispose();
    if (res.ok()) {
      setup.info().annotations.push({ type: 'auth', description: 'Reused the saved admin session (no credentials set).' });
      return;
    }
  }

  const { email, password } = adminCredentials();
  await page.goto('/admin/login');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/admin/dashboard');
  await expect(page.getByText('Total Students')).toBeVisible();
  ensureDir(path.dirname(ADMIN_STATE));
  await page.context().storageState({ path: ADMIN_STATE });
});
