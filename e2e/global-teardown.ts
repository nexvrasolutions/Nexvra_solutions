import fs from 'node:fs';
import { request, type FullConfig } from '@playwright/test';
import { ADMIN_STATE, cleanupTestData } from './helpers';

export default async function globalTeardown(config: FullConfig) {
  if (!fs.existsSync(ADMIN_STATE)) return;
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
  const api = await request.newContext({ baseURL, storageState: ADMIN_STATE });
  try {
    const removed = await cleanupTestData(api);
    if (removed.length) console.log(`[teardown] removed test data: ${removed.join(', ')}`);
  } finally {
    await api.dispose();
  }
}
