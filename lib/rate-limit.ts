import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Shared login rate limiting for serverless deployments.
 *
 * Counters live in the LoginThrottle table, so every Vercel instance sees the
 * same numbers (an in-memory counter is per instance and lost on cold starts).
 * Every attempt is counted atomically BEFORE the password is checked, so a burst
 * of parallel requests cannot slip past the limit.
 *
 * Fixed windows: a counter resets 15 minutes after its first attempt, so a
 * lockout always ends on its own and can never become permanent.
 * The counters never look at whether the account exists, so a lockout reveals
 * nothing about which email addresses are admins.
 */
export const LOGIN_WINDOW_SECONDS = 15 * 60;

/** Attempts allowed per window, per counter. */
export const LOGIN_LIMITS = {
  /** One IP address guessing one account: the normal brute-force case. */
  ipEmail: 5,
  /** One account from any number of IPs (distributed guessing). */
  email: 20,
  /** One IP address across any number of accounts (password spraying). */
  ip: 100,
} as const;

type Scope = keyof typeof LOGIN_LIMITS;
export type LoginThrottleKeys = Record<Scope, string>;

/** Same text for every lockout, whichever counter tripped and whether or not the account exists. */
export const TOO_MANY_ATTEMPTS_MESSAGE = 'Too many sign-in attempts. Please wait a few minutes and try again.';

const WINDOW = Prisma.raw(`interval '${LOGIN_WINDOW_SECONDS} seconds'`);

/** Emails and IPs are stored only as hashes. */
const hashKey = (scope: Scope, value: string) => `${scope}:${crypto.createHash('sha256').update(value).digest('hex')}`;

/**
 * Client IP. On Vercel these headers are set by the platform and any value sent
 * by the client is overwritten, so they cannot be spoofed there.
 */
export function clientIp(request: Request) {
  const h = request.headers;
  const raw = h.get('x-vercel-forwarded-for') || h.get('x-forwarded-for') || h.get('x-real-ip') || '';
  return raw.split(',')[0]?.trim() || 'unknown';
}

export function loginThrottleKeys(request: Request, email: string): LoginThrottleKeys {
  const ip = clientIp(request);
  const normalizedEmail = email.trim().toLowerCase();
  return {
    ipEmail: hashKey('ipEmail', `${ip}|${normalizedEmail}`),
    email: hashKey('email', normalizedEmail),
    ip: hashKey('ip', ip),
  };
}

/**
 * Counts this attempt on every counter in one atomic statement and returns the
 * number of seconds the caller must wait (0 = allowed to check the password).
 */
export async function registerLoginAttempt(keys: LoginThrottleKeys) {
  const rows = await prisma.$queryRaw<{ key: string; attempts: number; retryAfter: number }[]>`
    INSERT INTO "LoginThrottle" ("key", "attempts", "windowStart", "updatedAt")
    VALUES (${keys.ipEmail}, 1, now(), now()), (${keys.email}, 1, now(), now()), (${keys.ip}, 1, now(), now())
    ON CONFLICT ("key") DO UPDATE SET
      "attempts" = CASE WHEN "LoginThrottle"."windowStart" <= now() - ${WINDOW} THEN 1 ELSE "LoginThrottle"."attempts" + 1 END,
      "windowStart" = CASE WHEN "LoginThrottle"."windowStart" <= now() - ${WINDOW} THEN now() ELSE "LoginThrottle"."windowStart" END,
      "updatedAt" = now()
    RETURNING "key", "attempts",
      GREATEST(1, CEIL(EXTRACT(EPOCH FROM ("windowStart" + ${WINDOW} - now()))))::int AS "retryAfter"`;

  // Occasional housekeeping so abandoned counters do not pile up.
  if (Math.random() < 0.05) {
    await prisma.$executeRaw`DELETE FROM "LoginThrottle" WHERE "updatedAt" < now() - interval '1 day'`.catch((error) =>
      console.warn('Could not remove old login counters:', error)
    );
  }

  let wait = 0;
  for (const row of rows) {
    const scope = row.key.slice(0, row.key.indexOf(':')) as Scope;
    if (row.attempts > LOGIN_LIMITS[scope]) wait = Math.max(wait, row.retryAfter);
  }
  return wait;
}

/**
 * After a successful login: this IP has proven it knows this account's password,
 * so its IP+email counter is cleared. The account-wide and IP-wide counters only
 * give back this one attempt, so a login cannot reset an attack's progress.
 */
export async function registerLoginSuccess(keys: LoginThrottleKeys) {
  await prisma.$transaction([
    prisma.$executeRaw`DELETE FROM "LoginThrottle" WHERE "key" = ${keys.ipEmail}`,
    prisma.$executeRaw`UPDATE "LoginThrottle" SET "attempts" = GREATEST("attempts" - 1, 0) WHERE "key" IN (${keys.email}, ${keys.ip})`,
  ]);
}
