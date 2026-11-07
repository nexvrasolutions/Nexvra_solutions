import fs from 'node:fs';
import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import { PNG } from 'pngjs';
import {
  ADMIN_STATE,
  BYPASS_STATE,
  TEST_PREFIX,
  cleanupTestData,
  decodeQrPng,
  ensureDir,
  expectImageLoaded,
  fixturePath,
  trackPageErrors,
  uniqueSuffix,
} from './helpers';

/**
 * Student registration: complete form, photo upload, fixed Nexvra provider
 * fields, batch dates, admin search/filters, and the public QR page.
 * Every record created here is PWTEST-prefixed and removed afterwards.
 */
test.use({ storageState: ADMIN_STATE });

const NEXVRA = 'Nexvra Solutions';
const run = uniqueSuffix();

const full = {
  name: `${TEST_PREFIX} Full ${run}`,
  email: `pwtest.full.${run.toLowerCase()}@example.com`,
  phone: '+91 98765 43210',
  phoneDigits: '9876543210',
  address: `${TEST_PREFIX} 12 MG Road, Kochi ${run}`,
  course: `${TEST_PREFIX} Data Science ${run}`,
  department: `${TEST_PREFIX} Dept ${run}`,
  start: '2026-01-05',
  end: '2026-04-30',
  startText: '5 Jan 2026',
  endText: '30 Apr 2026',
};

const minimal = {
  name: `${TEST_PREFIX} Minimal ${run}`,
  course: `${TEST_PREFIX} UI Design ${run}`,
  start: '2026-06-01',
  end: '2027-03-31', // still running → "In Progress"
};

type StudentRecord = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  studentPhoto: string | null;
  courseName: string | null;
  department: string | null;
  instituteName: string;
  learnedFrom: string;
  batchStartDate: string | null;
  batchEndDate: string | null;
  profileToken: string;
  publicProfileEnabled: boolean;
};

async function getStudent(api: APIRequestContext, id: string): Promise<StudentRecord> {
  const res = await api.get(`/api/admin/students/${id}`);
  expect(res.ok(), `GET student ${id} -> ${res.status()}`).toBeTruthy();
  return (await res.json()).student;
}

async function findStudentByName(api: APIRequestContext, name: string): Promise<StudentRecord | undefined> {
  const res = await api.get('/api/admin/students');
  return ((await res.json()).students as StudentRecord[]).find((s) => s.fullName === name);
}

function writePng(name: string, rgb: [number, number, number]) {
  ensureDir(fixturePath(''));
  const png = new PNG({ width: 96, height: 96 });
  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = rgb[0];
    png.data[i + 1] = rgb[1];
    png.data[i + 2] = rgb[2];
    png.data[i + 3] = 255;
  }
  fs.writeFileSync(fixturePath(name), PNG.sync.write(png));
}

async function fillRequired(page: Page, s: { name: string; course: string; start: string; end: string }) {
  await page.getByLabel('Student Full Name').fill(s.name);
  await page.getByLabel('Course Name').selectOption('__custom__');
  await page.getByLabel('Custom course name').fill(s.course);
  await page.getByLabel('Batch Start Date').fill(s.start);
  await page.getByLabel('Batch Completion Date').fill(s.end);
}

function anonContext(browser: import('@playwright/test').Browser) {
  return browser.newContext({ storageState: BYPASS_STATE });
}

test.describe.serial('student registration and QR certificate', () => {
  let fullId = '';
  let minimalId = '';
  let verifyUrl = '';
  let storageBlocked = '';

  test.beforeAll(() => {
    writePng('student-photo-a.png', [164, 255, 0]);
    writePng('student-photo-b.png', [20, 60, 220]);
    fs.writeFileSync(fixturePath('not-an-image.txt'), 'plain text, not an image');
    // 6 MB of zeros with a .png name: rejected by the size check before any upload.
    fs.writeFileSync(fixturePath('too-large.png'), Buffer.alloc(6 * 1024 * 1024));
  });

  test.afterAll(async ({ request }) => {
    await cleanupTestData(request, run);
  });

  test('#9 #10 form shows Institute and Learned From fixed to Nexvra Solutions', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/admin/students/new');
    for (const section of ['Student Information', 'Course Information']) {
      await expect(page.getByRole('heading', { name: section })).toBeVisible();
    }
    for (const label of ['Institute / Organization', 'Learned From']) {
      const field = page.getByLabel(label);
      await expect(field).toHaveValue(NEXVRA);
      await expect(field).toHaveAttribute('readonly', '');
      await expect(field).not.toBeEditable();
    }
    // Department is optional and starts empty.
    await expect(page.getByLabel('Department', { exact: false }).first()).toHaveValue('');
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('#1 #8 #11 add a student with all text information, a custom course and batch dates', async ({ page }) => {
    await page.goto('/admin/students/new');
    await fillRequired(page, full);
    await page.getByLabel('Email Address').fill(full.email);
    await page.getByLabel('Contact Number').fill(full.phone);
    await page.getByLabel('Student Address').fill(full.address);
    await page.getByLabel('Department').selectOption('__custom__');
    await page.getByLabel('Custom department name').fill(full.department);

    await page.getByRole('button', { name: 'Create Student' }).click();
    await page.waitForURL(/\/admin\/students\/[^/?]+\?created=1$/);
    await expect(page.getByText('Student created successfully.')).toBeVisible();
    fullId = new URL(page.url()).pathname.split('/').pop()!;

    const details = page.locator('section', { has: page.getByRole('heading', { name: 'Student Details' }) });
    for (const text of [full.course, full.department, full.email, full.phone, full.address, full.startText, full.endText]) {
      await expect(details.getByText(text, { exact: true })).toBeVisible();
    }

    const saved = await getStudent(page.request, fullId);
    expect(saved).toMatchObject({
      fullName: full.name,
      email: full.email,
      phone: full.phone,
      address: full.address,
      courseName: full.course,
      department: full.department,
      instituteName: NEXVRA,
      learnedFrom: NEXVRA,
      studentPhoto: null,
    });
    expect(saved.batchStartDate?.slice(0, 10)).toBe(full.start);
    expect(saved.batchEndDate?.slice(0, 10)).toBe(full.end);
  });

  test('#2 #4 #5 #6 #7 add a student without photo, email, contact number, address or department', async ({ page }) => {
    await page.goto('/admin/students/new');
    await fillRequired(page, minimal);
    await page.getByRole('button', { name: 'Create Student' }).click();
    await page.waitForURL(/\/admin\/students\/[^/?]+\?created=1$/);
    minimalId = new URL(page.url()).pathname.split('/').pop()!;

    const saved = await getStudent(page.request, minimalId);
    expect(saved).toMatchObject({
      fullName: minimal.name,
      email: null,
      phone: null,
      address: null,
      department: null,
      studentPhoto: null,
      courseName: minimal.course,
      instituteName: NEXVRA,
      learnedFrom: NEXVRA,
    });
  });

  test('#9 #10 the API ignores attempts to change Institute or Learned From', async ({ request }) => {
    const res = await request.post('/api/admin/students', {
      data: {
        fullName: `${TEST_PREFIX} Override ${run}`,
        courseName: 'Override Course',
        batchStartDate: '2026-01-01',
        batchEndDate: '2026-02-01',
        instituteName: 'Some Other Institute',
        learnedFrom: 'Someone Else',
      },
    });
    expect(res.status()).toBe(201);
    const { student } = await res.json();
    expect(student.instituteName).toBe(NEXVRA);
    expect(student.learnedFrom).toBe(NEXVRA);

    const put = await request.put(`/api/admin/students/${student.id}`, {
      data: { instituteName: 'Changed', learnedFrom: 'Changed' },
    });
    expect(put.ok()).toBeTruthy();
    const after = await getStudent(request, student.id);
    expect(after.instituteName).toBe(NEXVRA);
    expect(after.learnedFrom).toBe(NEXVRA);
    await request.delete(`/api/admin/students/${student.id}`);
  });

  test('#12 invalid or missing batch dates are rejected', async ({ page, request }) => {
    await page.goto('/admin/students/new');
    await fillRequired(page, { name: `${TEST_PREFIX} Bad Dates ${run}`, course: 'Any Course', start: '2026-05-10', end: '2026-05-01' });
    await expect(page.getByText('Completion date cannot be earlier than the start date.')).toBeVisible();
    await page.getByRole('button', { name: 'Create Student' }).click();
    await expect(page.locator('form div[role="alert"]')).toContainText('Batch completion date cannot be earlier than the start date.');
    await expect(page).toHaveURL(/\/admin\/students\/new$/);

    await page.getByLabel('Batch Completion Date').fill('');
    await page.getByRole('button', { name: 'Create Student' }).click();
    await expect(page.locator('form div[role="alert"]')).toContainText('Batch completion date is required.');

    // The server enforces the same rules.
    const base = { fullName: `${TEST_PREFIX} Bad Dates ${run}`, courseName: 'Any Course' };
    const reversed = await request.post('/api/admin/students', {
      data: { ...base, batchStartDate: '2026-05-10', batchEndDate: '2026-05-01' },
    });
    expect(reversed.status()).toBe(400);
    expect((await reversed.json()).message).toMatch(/cannot be earlier/);
    const missing = await request.post('/api/admin/students', { data: { ...base, batchStartDate: '2026-05-10' } });
    expect(missing.status()).toBe(400);
    const noCourse = await request.post('/api/admin/students', {
      data: { fullName: base.fullName, batchStartDate: '2026-05-01', batchEndDate: '2026-05-10' },
    });
    expect(noCourse.status()).toBe(400);
    expect((await noCourse.json()).message).toMatch(/Course name/i);

    // Changing only the end date is checked against the stored start date.
    const partial = await request.put(`/api/admin/students/${fullId}`, { data: { batchEndDate: '2025-12-01' } });
    expect(partial.status()).toBe(400);
    expect(await findStudentByName(request, base.fullName)).toBeUndefined();
  });

  test('#3 photo preview is shown before saving; wrong type and oversize files are rejected', async ({ page }) => {
    await page.goto('/admin/students/new');
    const input = page.getByLabel('Student Photo');

    await input.setInputFiles(fixturePath('not-an-image.txt'));
    await expect(page.getByText('Only JPG, JPEG, PNG and WEBP images are allowed.')).toBeVisible();
    await expect(page.getByAltText('Student photo preview')).toHaveCount(0);

    await input.setInputFiles(fixturePath('too-large.png'));
    await expect(page.getByText('Photo must be smaller than 5 MB.')).toBeVisible();

    await input.setInputFiles(fixturePath('student-photo-a.png'));
    const preview = page.getByAltText('Student photo preview');
    await expect(preview).toBeVisible();
    await expect(preview).toHaveAttribute('src', /^blob:/);
    await expectImageLoaded(page, 'img[alt="Student photo preview"]');

    // Replacing the selection swaps the preview; removing it clears it.
    const firstSrc = await preview.getAttribute('src');
    await input.setInputFiles(fixturePath('student-photo-b.png'));
    await expect(preview).not.toHaveAttribute('src', firstSrc!);
    await page.getByRole('button', { name: 'Remove photo' }).click();
    await expect(page.getByAltText('Student photo preview')).toHaveCount(0);
  });

  test('#1 #14 upload a photo, then replace it (Supabase Storage)', async ({ page }) => {
    await page.goto(`/admin/students/${fullId}`);
    await page.getByLabel('Student Photo').setInputFiles(fixturePath('student-photo-a.png'));
    const upload = page.waitForResponse((r) => r.url().includes('/api/admin/upload'));
    await page.getByRole('button', { name: 'Update Student' }).click();
    const res = await upload;

    if (res.status() === 503) {
      // Storage is not configured: the admin gets a clear message and nothing is saved.
      const { message } = await res.json();
      storageBlocked = message;
      await expect(page.locator('form div[role="alert"]')).toContainText('was not saved');
      // Naming the env variable is fine; leaking an actual key value is not.
      expect(message).not.toMatch(/eyJ[A-Za-z0-9_-]{10,}|sb_secret_|Bearer\s/);
      expect((await getStudent(page.request, fullId)).studentPhoto).toBeNull();
      test.skip(true, `BLOCKED – image storage unavailable: ${message}`);
    }

    expect(res.ok(), `upload -> ${res.status()}`).toBeTruthy();
    await expect(page.getByText('Student updated successfully.')).toBeVisible();
    const first = (await getStudent(page.request, fullId)).studentPhoto;
    expect(first).toContain('/storage/v1/object/public/course-images/students/');
    await page.reload();
    await expectImageLoaded(page, `img[alt="${full.name} photo"]`);

    // Replace it.
    await page.getByLabel('Student Photo').setInputFiles(fixturePath('student-photo-b.png'));
    await page.getByRole('button', { name: 'Update Student' }).click();
    await expect(page.getByText('Student updated successfully.')).toBeVisible();
    const second = (await getStudent(page.request, fullId)).studentPhoto;
    expect(second).toContain('/students/');
    expect(second).not.toBe(first);
    // The replaced file is deleted from storage.
    await expect.poll(async () => (await page.request.get(first!)).status()).not.toBe(200);
  });

  test('#13 edit existing student information', async ({ page }) => {
    await page.goto(`/admin/students/${minimalId}`);
    await expect(page.getByLabel('Student Full Name')).toHaveValue(minimal.name);
    await expect(page.getByLabel('Custom course name')).toHaveValue(minimal.course);
    await expect(page.getByLabel('Batch Start Date')).toHaveValue(minimal.start);
    await expect(page.getByLabel('Batch Completion Date')).toHaveValue(minimal.end);

    minimal.course = `${minimal.course} Advanced`;
    await page.getByLabel('Custom course name').fill(minimal.course);
    await page.getByLabel('Student Address').fill(`${TEST_PREFIX} Edited address`);
    await page.getByLabel('Batch Completion Date').fill('2027-04-15');
    await page.getByRole('button', { name: 'Update Student' }).click();
    await expect(page.getByText('Student updated successfully.')).toBeVisible();

    await page.reload();
    await expect(page.getByLabel('Custom course name')).toHaveValue(minimal.course);
    await expect(page.getByLabel('Student Address')).toHaveValue(`${TEST_PREFIX} Edited address`);
    await expect(page.getByLabel('Batch Completion Date')).toHaveValue('2027-04-15');
    const saved = await getStudent(page.request, minimalId);
    expect(saved.courseName).toBe(minimal.course);
    expect(saved.batchEndDate?.slice(0, 10)).toBe('2027-04-15');
    expect(saved.instituteName).toBe(NEXVRA);

    // Clearing an optional field stores nothing.
    await page.getByLabel('Student Address').fill('');
    await page.getByRole('button', { name: 'Update Student' }).click();
    await expect(page.getByText('Student updated successfully.')).toBeVisible();
    expect((await getStudent(page.request, minimalId)).address).toBeNull();
  });

  test('search by name, course, email and contact number; filter by department and batch dates', async ({ page }) => {
    const rowsFor = async (query: string) => {
      await page.goto(`/admin/students?${query}`);
      return page.getByRole('row');
    };
    const expectRows = async (query: string, present: string[], absent: string[] = []) => {
      const rows = await rowsFor(query);
      for (const name of present) await expect(rows.filter({ hasText: name }), `${query} should list ${name}`).toHaveCount(1);
      for (const name of absent) await expect(rows.filter({ hasText: name }), `${query} should hide ${name}`).toHaveCount(0);
    };

    await expectRows(`search=${encodeURIComponent(full.name)}`, [full.name], [minimal.name]);
    await expectRows(`search=${encodeURIComponent(full.course)}`, [full.name], [minimal.name]);
    await expectRows(`search=${encodeURIComponent(full.email)}`, [full.name], [minimal.name]);
    await expectRows(`search=${full.phoneDigits}`, [full.name], [minimal.name]);
    await expectRows(`search=${encodeURIComponent('98765 43210')}`, [full.name], [minimal.name]);
    await expectRows(`department=${encodeURIComponent(full.department)}`, [full.name], [minimal.name]);
    await expectRows(`from=2026-05-01&search=${TEST_PREFIX}`, [minimal.name], [full.name]);
    await expectRows(`to=2026-05-31&search=${TEST_PREFIX}`, [full.name], [minimal.name]);
    await expectRows(`from=2026-01-01&to=2027-12-31&search=${TEST_PREFIX}`, [full.name, minimal.name]);

    // The filter form drives the same URL parameters.
    await page.goto('/admin/students');
    await page.getByLabel('Search students').fill(full.course);
    await page.getByLabel('Department').selectOption(full.department);
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('row').filter({ hasText: full.name })).toHaveCount(1);
    await expect(page.getByText(/1 result\(s\)/)).toBeVisible();
  });

  test('#16 the QR code downloads and decodes to the student verification URL', async ({ page, baseURL }) => {
    await page.goto(`/admin/students/${fullId}`);
    await expectImageLoaded(page, 'img[alt$="QR code"]');
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Download PNG' }).click();
    const download = await downloadPromise;
    const file = test.info().outputPath('student-qr.png');
    await download.saveAs(file);
    verifyUrl = decodeQrPng(fs.readFileSync(file));
    const s = await getStudent(page.request, fullId);
    expect(verifyUrl).toBe(`${baseURL}/verify/${s.profileToken}`);
  });

  test('#17 #18 the public page shows the certificate details and no private contact details', async ({ browser }) => {
    const anon = await anonContext(browser);
    const pub = await anon.newPage();
    const errors = trackPageErrors(pub);
    const res = await pub.goto(verifyUrl);
    expect(res?.status()).toBe(200);

    await expect(pub.getByRole('link', { name: NEXVRA })).toBeVisible();
    await expect(pub.getByRole('heading', { name: full.name })).toBeVisible();
    const field = (label: string) => pub.locator('dl > div', { has: pub.locator('dt', { hasText: new RegExp(`^${label}$`, 'i') }) }).locator('dd');
    await expect(field('Course Name')).toHaveText(full.course);
    await expect(field('Learned From')).toHaveText(NEXVRA);
    await expect(field('Institute')).toHaveText(NEXVRA);
    await expect(field('Batch Start Date')).toHaveText(full.startText);
    await expect(field('Batch Completion Date')).toHaveText(full.endText);
    await expect(field('Department')).toHaveText(full.department);
    await expect(pub.getByTestId('verification-status')).toHaveText(/Verified · Course Completed/);
    if (!storageBlocked) await expectImageLoaded(pub, `img[alt="${full.name} photo"]`);

    // Private values must not be anywhere in the delivered HTML (including the RSC payload)…
    const html = await pub.content();
    for (const secret of [full.email, full.phone, full.phoneDigits, full.address]) {
      expect(html, `public page must not contain "${secret}"`).not.toContain(secret);
    }
    // …and the page must not even show the private field labels.
    const visible = await pub.locator('main').innerText();
    for (const label of [/email/i, /contact number/i, /phone/i, /address/i]) {
      expect(visible, `public page must not show ${label}`).not.toMatch(label);
    }
    await pub.screenshot({ path: test.info().outputPath('verify-full.png'), fullPage: true });
    expect(errors, errors.join('\n')).toEqual([]);
    await anon.close();
  });

  test('#7 the public page hides an empty department and shows in-progress status', async ({ browser, request }) => {
    const s = await getStudent(request, minimalId);
    const anon = await anonContext(browser);
    const pub = await anon.newPage();
    expect((await pub.goto(`/verify/${s.profileToken}`))?.status()).toBe(200);
    await expect(pub.getByRole('heading', { name: minimal.name })).toBeVisible();
    await expect(pub.getByText(minimal.course)).toBeVisible();
    await expect(pub.locator('dt', { hasText: /^Department$/i })).toHaveCount(0);
    await expect(pub.locator('dt', { hasText: /^Learned From$/i })).toHaveCount(1);
    await expect(pub.getByTestId('verification-status')).toHaveText(/Course In Progress/);
    await expect(pub.locator('img[alt$=" photo"]')).toHaveCount(0);
    await anon.close();
  });

  test('#19 QR links of existing (pre-update) students still work', async ({ browser, request }) => {
    const res = await request.get('/api/admin/students');
    const existing = ((await res.json()).students as StudentRecord[]).filter(
      (s) => !s.fullName.startsWith(TEST_PREFIX) && s.publicProfileEnabled
    );
    test.skip(existing.length === 0, 'no pre-existing public students in the database');
    const anon = await anonContext(browser);
    const pub = await anon.newPage();
    for (const s of existing) {
      const r = await pub.goto(`/verify/${s.profileToken}`);
      expect(r?.status(), `existing QR for ${s.fullName}`).toBe(200);
      await expect(pub.getByRole('heading', { name: s.fullName })).toBeVisible();
      await expect(pub.locator('dt', { hasText: /^Institute$/i })).toHaveCount(1);
      if (s.email) expect(await pub.content()).not.toContain(s.email);
    }
    test.info().annotations.push({ type: 'checked', description: `${existing.length} existing student QR link(s)` });
    await anon.close();
  });

  test('#15 delete a student safely (cancel keeps it, confirm removes it and revokes the QR)', async ({ page, browser }) => {
    const s = await getStudent(page.request, minimalId);
    await page.goto(`/admin/students?search=${encodeURIComponent(minimal.name)}`);
    const row = page.getByRole('row').filter({ hasText: minimal.name });

    page.once('dialog', (d) => d.dismiss());
    await row.getByRole('button', { name: 'Delete' }).click();
    await expect(row).toHaveCount(1);
    expect((await page.request.get(`/api/admin/students/${minimalId}`)).status()).toBe(200);

    page.once('dialog', (d) => {
      expect(d.message()).toContain(minimal.name);
      d.accept();
    });
    await row.getByRole('button', { name: 'Delete' }).click();
    await expect(row).toHaveCount(0);
    expect((await page.request.get(`/api/admin/students/${minimalId}`)).status()).toBe(404);

    const anon = await anonContext(browser);
    const pub = await anon.newPage();
    expect((await pub.goto(`/verify/${s.profileToken}`))?.status()).toBe(404);
    await anon.close();

    // Delete the full student from its details page as well.
    await page.goto(`/admin/students/${fullId}`);
    page.once('dialog', (d) => d.accept());
    await page.getByRole('button', { name: 'Delete Student' }).click();
    await page.waitForURL('**/admin/students');
    expect((await page.request.get(`/api/admin/students/${fullId}`)).status()).toBe(404);
  });
});
