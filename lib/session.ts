import { SignJWT, jwtVerify } from "jose";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be set to at least 32 characters.");
}

const secret = new TextEncoder().encode(jwtSecret);

/** How long an admin session lasts (cookie, token and database row). */
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

export type AdminSession = {
  /** Id of the AdminSession row; the session is revoked by revoking that row. */
  sid: string;
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
};

export async function createSessionToken(payload: AdminSession) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret);
}

/**
 * Checks the signature and expiry only (cheap enough for the proxy). Whether the
 * session was revoked is checked against the database in lib/auth.ts.
 * Tokens without a session id (issued before server-side sessions) are rejected.
 */
export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
  if (typeof payload.sid !== "string" || !payload.sid || typeof payload.userId !== "string") {
    throw new Error("Session token has no session id.");
  }
  return payload as unknown as AdminSession;
}
