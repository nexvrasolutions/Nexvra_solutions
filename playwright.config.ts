import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

// Test-only secrets (E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD) live in .env.e2e,
// which is git-ignored. Real environment variables take precedence.
if (fs.existsSync('.env.e2e')) process.loadEnvFile('.env.e2e');

/**
 * End-to-end tests for the Nexvra site and the admin QR certificate system.
 *
 * Admin credentials are read from the environment or from the git-ignored
 * .env.e2e file (see .env.e2e.example) and are never stored in the repo.
 *
 * All records the suite creates are prefixed with "PWTEST" (and use @example.com
 * emails) and are removed again by e2e/global-teardown.ts.
 */
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const isRemote = !baseURL.startsWith('http://localhost');

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e-results/artifacts',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 2,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'e2e-results/html-report', open: 'never' }],
    ['json', { outputFile: 'e2e-results/results.json' }],
  ],
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',
  use: {
    baseURL,
    // Anonymous visitor state; holds only the Vercel bypass cookie when testing a Preview.
    storageState: path.join(__dirname, 'e2e', '.auth', 'visitor.json'),
    navigationTimeout: 90_000,
    actionTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
      dependencies: ['setup'],
    },
    {
      name: 'tablet',
      grep: /@responsive/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 }, isMobile: false, hasTouch: true },
      dependencies: ['setup'],
    },
    {
      name: 'mobile',
      grep: /@responsive/,
      use: { ...devices['Pixel 7'] },
      dependencies: ['setup'],
    },
  ],
  // Only start a local server when testing locally; a Preview URL is already running.
  webServer: isRemote
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
