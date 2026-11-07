/**
 * Small in-memory limiter for failed admin logins.
 * Keyed by client IP + email so one attacker cannot lock out other users.
 * (Per server instance; put a shared store such as Redis in front for multi-instance deploys.)
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

type Entry = { failures: number; firstFailure: number };
const store = new Map<string, Entry>();

function current(key: string) {
  const entry = store.get(key);
  if (entry && Date.now() - entry.firstFailure > WINDOW_MS) {
    store.delete(key);
    return undefined;
  }
  return entry;
}

export function loginKey(request: Request, email: string) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  return `${ip}|${email.toLowerCase()}`;
}

/** Seconds until another attempt is allowed, or 0 if not blocked. */
export function retryAfterSeconds(key: string) {
  const entry = current(key);
  if (!entry || entry.failures < MAX_FAILURES) return 0;
  return Math.ceil((entry.firstFailure + WINDOW_MS - Date.now()) / 1000);
}

export function recordFailure(key: string) {
  const entry = current(key);
  if (entry) entry.failures += 1;
  else store.set(key, { failures: 1, firstFailure: Date.now() });
}

export function clearFailures(key: string) {
  store.delete(key);
}
