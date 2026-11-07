import fs from 'node:fs';
import path from 'node:path';
import { chromium, type FullConfig } from '@playwright/test';
import { BYPASS_STATE } from './helpers';

/**
 * Prepares the "anonymous visitor" browser state every test starts from.
 *
 * When testing a protected Vercel Preview, VERCEL_AUTOMATION_BYPASS_SECRET is
 * exchanged once for Vercel's bypass cookie, scoped to the preview host only.
 * The secret is never sent as a header on every request, so it cannot leak to
 * third-party hosts (Supabase Storage, fonts, form services).
 */
export default async function globalSetup(config: FullConfig) {
  fs.mkdirSync(path.dirname(BYPASS_STATE), { recursive: true });
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';

  if (!secret || baseURL.startsWith('http://localhost')) {
    fs.writeFileSync(BYPASS_STATE, JSON.stringify({ cookies: [], origins: [] }));
    return;
  }

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const url = new URL('/', baseURL);
    url.searchParams.set('x-vercel-protection-bypass', secret);
    url.searchParams.set('x-vercel-set-bypass-cookie', 'true');
    const res = await context.request.get(url.toString(), { maxRedirects: 0 });
    if (res.status() === 401 || res.status() === 403) {
      throw new Error(`Vercel rejected the protection bypass secret (${res.status()}).`);
    }
    await context.storageState({ path: BYPASS_STATE });
    const host = new URL(baseURL).hostname;
    const cookies = (await context.cookies()).filter((c) => host.endsWith(c.domain.replace(/^\./, '')));
    if (cookies.length === 0) throw new Error('Vercel did not set a protection bypass cookie.');
  } finally {
    await browser.close();
  }
}
