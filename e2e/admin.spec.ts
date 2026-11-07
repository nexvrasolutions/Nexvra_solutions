import fs from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { PNG } from 'pngjs';
import {
  ADMIN_STATE,
  BYPASS_STATE,
  TEST_PREFIX,
  cleanupTestData,
  decodeQrPng,
  ensureDir,
  expectImageLoaded,
  expectNoHorizontalOverflow,
  fixturePath,
  trackPageErrors,
  uniqueSuffix,
} from './helpers';

test.use({ storageState: ADMIN_STATE });

const run = uniqueSuffix();
const course = {
  code: `${TEST_PREFIX}-${run}`,
  name: `${TEST_PREFIX} Course ${run}`,
  slug: `pwtest-course-${run.toLowerCase()}`,
};
const student = {
  name: `${TEST_PREFIX} Student ${run}`,
  email: `pwtest.${run.toLowerCase()}@example.com`,
  phone: '9876543210',
  customCourse: `${TEST_PREFIX} Custom Course ${run}`,
};

function writeFixtures() {
  ensureDir(fixturePath(''));
  const png = new PNG({ width: 64, height: 64 });
  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = 164;
    png.data[i + 1] = 255;
    png.data[i + 2] = 0;
    png.data[i + 3] = 255;
  }
  fs.writeFileSync(fixturePath('course.png'), PNG.sync.write(png));
  fs.writeFileSync(fixturePath('not-an-image.txt'), 'plain text, not an image');
}

async function acceptNextDialog(page: Page, promptText?: string) {
  page.once('dialog', (dialog) => dialog.accept(promptText));
}

test.describe('admin dashboard and navigation', () => {
  test('dashboard shows statistics and recent students', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/admin/dashboard');
    for (const label of ['Total Students', 'Active Profiles', 'Course Catalog', 'Enrollments', 'Completed']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole('heading', { name: 'Recent Students' })).toBeVisible();
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('admin navigation reaches every section @responsive', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/admin/dashboard');
    const nav = page.getByRole('navigation', { name: 'Admin' });
    const sections: [string, RegExp, string][] = [
      ['Students', /\/admin\/students$/, 'Student Management'],
      ['Add Student', /\/admin\/students\/new$/, 'Add New Student'],
      ['Courses', /\/admin\/courses$/, 'Course Management'],
      ['Add Course', /\/admin\/courses\/new$/, 'Add New Course'],
      ['Option Management', /\/admin\/options$/, 'Option Management'],
      ['Dashboard', /\/admin\/dashboard$/, 'Recent Students'],
    ];
    for (const [label, url, heading] of sections) {
      await nav.getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe.serial('student, course and QR certificate lifecycle', () => {
  let studentId = '';
  let verifyUrl = '';

  test.beforeAll(() => writeFixtures());

  test.afterAll(async ({ request }) => {
    await cleanupTestData(request, run);
  });

  test('create a course through the form', async ({ page }) => {
    await page.goto('/admin/courses/new');
    await page.getByLabel('Course Code').fill(course.code);
    await page.getByLabel('Course Name').fill(course.name);
    await page.getByLabel('Slug').fill(course.slug);
    await page.getByLabel('Duration').fill('6 weeks');
    await page.getByLabel('Level').fill('Beginner');
    await page.getByLabel('Description').fill('Created by the automated Playwright suite.');
    await page.getByLabel('Technologies').fill('React, Next.js');
    await page.getByRole('button', { name: 'Create Course' }).click();
    await page.waitForURL('**/admin/courses');
    await expect(page.getByRole('heading', { name: course.name })).toBeVisible();
  });

  test('duplicate course code is rejected with a clear message', async ({ page }) => {
    await page.goto('/admin/courses/new');
    await page.getByLabel('Course Code').fill(course.code);
    await page.getByLabel('Course Name').fill(`${course.name} dup`);
    await page.getByLabel('Slug').fill(`${course.slug}-dup`);
    await page.getByRole('button', { name: 'Create Course' }).click();
    await expect(page.getByText(/already exists/i)).toBeVisible();
  });

  test('course search finds the course and edits persist', async ({ page }) => {
    await page.goto('/admin/courses');
    await page.getByPlaceholder('Search by course name or code').fill(course.code);
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('heading', { name: course.name })).toBeVisible();
    await page.getByRole('link', { name: 'Edit course' }).first().click();
    // Wait for hydration: interacting earlier triggers a native form submit in dev.
    await page.waitForLoadState('networkidle');
    await expect(page.getByLabel('Course Name')).toHaveValue(course.name);
    await page.getByLabel('Duration').fill('8 weeks');
    await page.getByRole('button', { name: 'Update Course' }).click();
    await page.waitForURL('**/admin/courses');
    await expect(page.getByText('8 weeks').first()).toBeVisible();
  });

  test('course image: wrong file type is rejected, a real image uploads or reports a clear storage error', async ({ page }) => {
    await page.goto('/admin/courses');
    await page.getByPlaceholder('Search by course name or code').fill(course.code);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('link', { name: 'Edit course' }).first().click();
    // Wait for hydration: interacting earlier triggers a native form submit in dev.
    await page.waitForLoadState('networkidle');

    const fileInput = page.getByLabel('Course Image');
    await fileInput.setInputFiles(fixturePath('not-an-image.txt'));
    await expect(page.getByText('Only JPG, PNG and WebP images are allowed.')).toBeVisible();

    const upload = page.waitForResponse((res) => res.url().includes('/api/admin/upload'));
    await fileInput.setInputFiles(fixturePath('course.png'));
    const res = await upload;
    if (res.ok()) {
      await expect(page.getByAltText('Course image preview')).toBeVisible();
      await page.getByRole('button', { name: 'Update Course' }).click();
      await page.waitForURL('**/admin/courses');
      const api = await page.request.get('/api/admin/courses');
      const saved = (await api.json()).courses.find((c: { code: string }) => c.code === course.code);
      expect(saved.image).toContain('/storage/v1/object/public/');
    } else {
      // Storage not configured: the admin must see an actionable message, not a raw stack trace.
      const body = await res.json();
      test.info().annotations.push({ type: 'blocked', description: `Image storage unavailable: ${body.message}` });
      await expect(page.getByText(body.message)).toBeVisible();
      expect(body.message).toMatch(/storage|configured|upload/i);
      // Naming the env variable is fine; leaking an actual key value is not.
      expect(body.message).not.toMatch(/eyJ[A-Za-z0-9_-]{10,}|sb_secret_|Bearer\s/);
    }
  });

  test('student form validates input', async ({ page }) => {
    await page.goto('/admin/students/new');
    await page.getByLabel('Student Full Name').fill('P');
    await page.getByLabel('Email Address').fill(student.email);
    await page.getByLabel('Contact Number').fill('12');
    await page.getByRole('button', { name: 'Create Student' }).click();
    await expect(page.getByText(/name must be at least 2 characters|contact number/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/students\/new$/);
  });

  test('create a student with a custom course and program type', async ({ page }) => {
    await page.goto('/admin/students/new');
    await page.getByLabel('Student Full Name').fill(student.name);
    await page.getByLabel('Email Address').fill(student.email);
    await page.getByLabel('Contact Number').fill(student.phone);
    await page.getByLabel('Course Name').selectOption('__custom__');
    await page.getByLabel('Custom course name').fill(student.customCourse);
    await page.getByLabel('Batch Start Date').fill('2026-01-05');
    await page.getByLabel('Batch Completion Date').fill('2026-04-30');
    // Select by value: option labels are admin-editable (Option Management).
    await page.getByLabel('Program Type').selectOption('INTERNSHIP');
    await page.getByLabel('Batch Name / Code').fill('2026-A');
    await page.getByRole('button', { name: 'Create Student' }).click();
    await page.waitForURL(/\/admin\/students\/[^/]+\?created=1$/);
    await expect(page.getByText('Student created successfully.')).toBeVisible();

    await page.goto(`/admin/students?search=${encodeURIComponent(student.email)}`);
    const row = page.getByRole('row').filter({ hasText: student.name });
    await expect(row).toBeVisible();
    await expect(row).toContainText(student.customCourse);
    await expect(row).toContainText('2026-A');
    await expect(row).toContainText('5 Jan 2026 – 30 Apr 2026');

    const api = await page.request.get('/api/admin/students');
    const created = (await api.json()).students.find((s: { email: string }) => s.email === student.email);
    expect(created.programType).toBe('INTERNSHIP');
    studentId = created.id;
  });

  test('duplicate student email is rejected', async ({ page }) => {
    await page.goto('/admin/students/new');
    await page.getByLabel('Student Full Name').fill(`${student.name} dup`);
    await page.getByLabel('Email Address').fill(student.email.toUpperCase());
    await page.getByLabel('Course Name').selectOption('__custom__');
    await page.getByLabel('Custom course name').fill(student.customCourse);
    await page.getByLabel('Batch Start Date').fill('2026-01-05');
    await page.getByLabel('Batch Completion Date').fill('2026-04-30');
    await page.getByRole('button', { name: 'Create Student' }).click();
    await expect(page.getByText('A student with this email already exists.')).toBeVisible();
  });

  test('student search works by student code', async ({ page }) => {
    const api = await page.request.get(`/api/admin/students/${studentId}`);
    const { student: s } = await api.json();
    await page.goto(`/admin/students?search=${encodeURIComponent(s.studentCode)}`);
    await expect(page.getByRole('row').filter({ hasText: student.name })).toBeVisible();
  });

  test('a student with no courses yet still has a valid verification page', async ({ browser, page }) => {
    const api = await page.request.get(`/api/admin/students/${studentId}`);
    const { student: s } = await api.json();
    const anon = await browser.newContext({ storageState: BYPASS_STATE });
    const pub = await anon.newPage();
    const res = await pub.goto(`/verify/${s.profileToken}`);
    expect(res?.status()).toBe(200);
    await expect(pub.getByRole('heading', { name: student.name })).toBeVisible();
    await expect(pub.getByText('Invalid or Revoked QR Code')).toHaveCount(0);
    await expect(pub.getByText(student.customCourse)).toBeVisible();
    // No catalog enrollments yet, so the course records list is not shown.
    await expect(pub.getByRole('heading', { name: 'Course Records' })).toHaveCount(0);
    await anon.close();
  });

  test('edit student details and assign a completed course', async ({ page }) => {
    await page.goto(`/admin/students/${studentId}`);
    await expect(page.getByLabel('Student Full Name')).toHaveValue(student.name);
    await expect(page.getByLabel('Custom course name')).toHaveValue(student.customCourse);
    await expect(page.getByLabel('Program Type')).toHaveValue('INTERNSHIP');
    await page.getByLabel('Batch Name / Code').fill('2026-B');
    await page.getByRole('button', { name: 'Update Student' }).click();
    await expect(page.getByText('Student updated successfully.')).toBeVisible();

    await page.reload();
    await expect(page.getByLabel('Batch Name / Code')).toHaveValue('2026-B');

    await page.getByLabel('Course', { exact: true }).selectOption({ label: course.name });
    await page.getByLabel('Status').selectOption('COMPLETED');
    await page.getByRole('button', { name: 'Assign Course' }).click();
    const history = page.locator('section', { has: page.getByRole('heading', { name: 'Course History' }) });
    await expect(history.getByText(course.name)).toBeVisible();
    await expect(history.getByText('COMPLETED', { exact: true })).toBeVisible();
  });

  test('QR code is shown, downloads as PNG and decodes to the public verify URL', async ({ page, baseURL }) => {
    await page.goto(`/admin/students/${studentId}`);
    await expectImageLoaded(page, 'img[alt$="QR code"]');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Download PNG' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/-qr\.png$/);
    const file = test.info().outputPath('student-qr.png');
    await download.saveAs(file);
    const buffer = fs.readFileSync(file);
    await test.info().attach('downloaded-qr', { body: buffer, contentType: 'image/png' });

    verifyUrl = decodeQrPng(buffer);
    const api = await page.request.get(`/api/admin/students/${studentId}`);
    const { student: s } = await api.json();
    expect(verifyUrl).toBe(`${baseURL}/verify/${s.profileToken}`);
  });

  test('scanning the QR opens the public verification page with the right data', async ({ browser }) => {
    const anon = await browser.newContext({ storageState: BYPASS_STATE });
    const pub = await anon.newPage();
    const errors = trackPageErrors(pub);
    const res = await pub.goto(verifyUrl);
    expect(res?.status()).toBe(200);
    await expect(pub.getByRole('heading', { name: student.name })).toBeVisible();
    await expect(pub.getByText(student.customCourse)).toBeVisible();
    await expect(pub.getByText('2026-B')).toBeVisible();
    await expect(pub.getByText(course.name)).toBeVisible();
    await expect(pub.getByText('COMPLETED', { exact: true })).toBeVisible();
    await expectImageLoaded(pub, 'img[alt$="QR code"]');

    // Contact details must not be published in full on a public page.
    const text = await pub.locator('body').innerText();
    expect(text).not.toContain(student.email);
    expect(text).not.toContain(student.phone);
    // The page must not leak internal database IDs.
    expect(await pub.content()).not.toContain(`/api/admin/students/${studentId}`);
    await pub.screenshot({ path: test.info().outputPath('verify-page.png'), fullPage: true });
    expect(errors, errors.join('\n')).toEqual([]);
    await anon.close();
  });

  test('verification page is responsive @responsive', async ({ page, browser }) => {
    test.skip(!verifyUrl, 'requires the QR test in the desktop project');
    const anon = await browser.newContext({ storageState: BYPASS_STATE, viewport: page.viewportSize()! });
    const pub = await anon.newPage();
    await pub.goto(verifyUrl);
    await expectNoHorizontalOverflow(pub);
    await anon.close();
  });

  test('"View public" from the student list opens the same verification page', async ({ page, context }) => {
    await page.goto(`/admin/students?search=${encodeURIComponent(student.email)}`);
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('row').filter({ hasText: student.name }).getByRole('link', { name: 'View public' }).click(),
    ]);
    await popup.waitForLoadState();
    expect(new URL(popup.url()).pathname).toBe(new URL(verifyUrl).pathname);
    await expect(popup.getByRole('heading', { name: student.name })).toBeVisible();
    await popup.close();
  });

  test('legacy /students/<token> link redirects to /verify/<token>', async ({ browser }) => {
    const token = new URL(verifyUrl).pathname.split('/').pop();
    const anon = await browser.newContext({ storageState: BYPASS_STATE });
    const pub = await anon.newPage();
    await pub.goto(`/students/${token}`);
    await expect(pub).toHaveURL(new RegExp(`/verify/${token}$`));
    await anon.close();
  });

  test('disabling the public profile revokes the verification page', async ({ page, browser }) => {
    await page.goto(`/admin/students/${studentId}`);
    await page.getByLabel('Enable public student profile').uncheck();
    await page.getByRole('button', { name: 'Update Student' }).click();
    await expect(page.getByText('Student updated successfully.')).toBeVisible();

    const anon = await browser.newContext({ storageState: BYPASS_STATE });
    const pub = await anon.newPage();
    const res = await pub.goto(verifyUrl);
    expect(res?.status()).toBe(404);
    await anon.close();

    await page.getByLabel('Enable public student profile').check();
    await page.getByRole('button', { name: 'Update Student' }).click();
    await expect(page.getByText('Student updated successfully.')).toBeVisible();
  });

  test('unknown verification token shows not found', async ({ browser }) => {
    const anon = await browser.newContext({ storageState: BYPASS_STATE });
    const pub = await anon.newPage();
    const res = await pub.goto('/verify/0000000000000000000000000000000000000000000000ff');
    expect(res?.status()).toBe(404);
    await anon.close();
  });

  test('remove the course enrollment', async ({ page }) => {
    await page.goto(`/admin/students/${studentId}`);
    const history = page.locator('section', { has: page.getByRole('heading', { name: 'Course History' }) });
    await acceptNextDialog(page);
    await history.getByRole('button', { name: 'Remove' }).first().click();
    await expect(history.getByText(course.name)).toHaveCount(0);
    await expect(history.getByText('No courses have been assigned yet.')).toBeVisible();
  });

  test('delete the student', async ({ page, browser }) => {
    await page.goto(`/admin/students/${studentId}`);
    await acceptNextDialog(page);
    await page.getByRole('button', { name: 'Delete Student' }).click();
    await page.waitForURL('**/admin/students');
    await expect(page.getByText(student.email)).toHaveCount(0);

    const anon = await browser.newContext({ storageState: BYPASS_STATE });
    const pub = await anon.newPage();
    const res = await pub.goto(verifyUrl);
    expect(res?.status()).toBe(404);
    await anon.close();
  });

  test('delete the course', async ({ page }) => {
    await page.goto(`/admin/courses?search=${encodeURIComponent(course.code)}`);
    await page.getByRole('link', { name: 'Edit course' }).first().click();
    // Wait for hydration: interacting earlier triggers a native form submit in dev.
    await page.waitForLoadState('networkidle');
    await acceptNextDialog(page);
    await page.getByRole('button', { name: 'Delete Course' }).click();
    await page.waitForURL('**/admin/courses');
    await expect(page.getByRole('heading', { name: course.name })).toHaveCount(0);
  });
});

test.describe.serial('option management', () => {
  test.afterAll(async ({ request }) => {
    await cleanupTestData(request, run);
  });

  for (const label of ['Department', 'Institution'] as const) {
    test(`${label}: create, reject duplicate, rename, toggle and delete`, async ({ page }) => {
      const name = `${TEST_PREFIX} ${label} ${run}`;
      const renamed = `${name} renamed`;
      await page.goto('/admin/options');
      const card = page.locator('section', { has: page.getByRole('heading', { name: `${label} Management` }) });

      await card.getByPlaceholder(`New ${label.toLowerCase()} name`).fill(name);
      await card.getByRole('button', { name: `Add ${label}` }).click();
      await expect(card.getByText(`${label} created.`)).toBeVisible();
      await expect(card.getByRole('cell', { name, exact: true })).toBeVisible();

      await card.getByPlaceholder(`New ${label.toLowerCase()} name`).fill(name);
      await card.getByRole('button', { name: `Add ${label}` }).click();
      await expect(card.getByText(/already exists/i)).toBeVisible();

      const row = () => card.getByRole('row').filter({ hasText: name });
      await acceptNextDialog(page, renamed);
      await row().getByRole('button', { name: 'Edit' }).click();
      await expect(card.getByRole('cell', { name: renamed, exact: true })).toBeVisible();

      await row().getByRole('button', { name: 'Deactivate' }).click();
      await expect(row().getByText('Inactive')).toBeVisible();
      await page.reload();
      await expect(row().getByText('Inactive')).toBeVisible();

      await acceptNextDialog(page);
      await row().getByRole('button', { name: 'Delete' }).click();
      await expect(card.getByRole('cell', { name: renamed, exact: true })).toHaveCount(0);
    });
  }

  test('Program type: create, rename keeps its type, delete', async ({ page }) => {
    const name = `${TEST_PREFIX} Program ${run}`;
    await page.goto('/admin/options');
    const card = page.locator('section', { has: page.getByRole('heading', { name: 'Program Type Management' }) });
    const existing = await page.request.get('/api/admin/options/program-types');
    const used = new Set(((await existing.json()).programTypes as { value: string }[]).map((p) => p.value));
    const value = ['CUSTOM', 'INTERNSHIP', 'COURSE'].find((v) => !used.has(v));
    test.skip(!value, 'all program type values already have an option');

    await card.getByPlaceholder('New program type name').fill(name);
    await card.getByRole('combobox').selectOption(value!);
    await card.getByRole('button', { name: 'Add Program Type' }).click();
    await expect(card.getByText('Program Type created.')).toBeVisible();
    const row = () => card.getByRole('row').filter({ hasText: name });
    await expect(row()).toBeVisible();

    await acceptNextDialog(page, `${name} renamed`);
    await row().getByRole('button', { name: 'Edit' }).click();
    await expect(card.getByText('Program Type updated.')).toBeVisible();
    await page.reload();
    await expect(row()).toContainText(`${name} renamed`);

    await acceptNextDialog(page);
    await row().getByRole('button', { name: 'Delete' }).click();
    await expect(row()).toHaveCount(0);
  });
});
